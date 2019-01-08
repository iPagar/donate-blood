import React from "react";
import PropTypes from "prop-types";
import VKConnect from "@vkontakte/vkui-connect";
import DataManager from "../services/DataManager";
import Database from "../services/Database";
import Geocode from "../services/Geocode";

import {
  Root,
  View,
  Epic,
  Tabbar,
  TabbarItem,
  ScreenSpinner
} from "@vkontakte/vkui";
import Icon28Place from "@vkontakte/icons/dist/28/place";
import Icon28Search from "@vkontakte/icons/dist/28/search";

import StationsList from "./StationsList";
import StationsMap from "./StationsMap";
import FindCity from "./FindCity";
import Station from "./Station";

class FindStations extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeView: "findStations",
      activeStory: "stationsList",
      isLoading: false,
      styleTabButton: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      },
      city: null,
      stations: [],
      popout: null
    };
  }

  onStoryChange = e => {
    this.setState({ activeStory: e.currentTarget.dataset.story });
  };

  showTabbar = () => {
    return (
      <Tabbar>
        <TabbarItem
          onClick={this.onStoryChange}
          selected={this.state.activeStory === "stationsList"}
          data-story="stationsList"
        >
          <div style={this.state.styleTabButton}>
            <Icon28Search />
          </div>
        </TabbarItem>
        <TabbarItem
          onClick={this.onStoryChange}
          selected={this.state.activeStory === "stationsMap"}
          data-story="stationsMap"
        >
          <div style={this.state.styleTabButton}>
            <Icon28Place />
          </div>
        </TabbarItem>
      </Tabbar>
    );
  };

  go = e => {
    this.setState({ activeView: e.currentTarget.dataset.panel });
  };

  city = city => {
    this.setState({ city });
    this.setState({ activeView: "station" });
  };

  showEpic = () => {
    return (
      <Root activeView={this.state.activeView}>
        <Epic
          id="findStations"
          activeStory={this.state.activeStory}
          tabbar={this.showTabbar()}
        >
          <View
            popout={this.state.popout}
            id="stationsList"
            activePanel="stationsList"
          >
            <StationsList
              id="stationsList"
              go={this.props.go}
              stations={this.state.stations}
              city={this.city}
            />
          </View>
          <View
            popout={this.state.popout}
            id="stationsMap"
            activePanel="stationsMap"
          >
            <StationsMap
              id="stationsMap"
              stations={this.state.stations}
              city={this.city}
            />
          </View>
        </Epic>
        <View id="findCityView" activePanel="findCity">
          <FindCity id="findCity" go={this.go} necessarily={true} />
        </View>
        <Station
          id="station"
          go={this.go}
          city={this.city}
          data={this.state.city}
        />
      </Root>
    );
  };

  getCity() {
    VKConnect.subscribe(async e => {
      switch (e.detail.type) {
        case "VKWebAppGeodataResult":
          /* ЗАГРУЗКА ГЕОПОЗИЦИИ*/
          if (DataManager.getCity() == null) {
            if (this._isMounted)
              this.setState({ isLoading: true, popout: <ScreenSpinner /> });
            DataManager.setGeo(e.detail.data.lat, e.detail.data.long);
            const city = await Geocode.geoToCity(DataManager.getGeo());
            const cities = await Database.getCities(city);

            if (Object.keys(cities).length > 0) {
              DataManager.setCity(cities[0]);
              await this.updateStations();
              if (this._isMounted)
                this.setState({ isLoading: false, popout: null });
            } else this.setState({ activeView: "findCityView" });
          } else {
            if (this._isMounted)
              this.setState({ isLoading: true, popout: <ScreenSpinner /> });

            await this.updateStations();

            if (this._isMounted)
              this.setState({ isLoading: false, popout: null });
          }
          break;
        default:
          VKConnect.send("VKWebAppGetGeodata", {});
          break;
      }
    });
    VKConnect.send("VKWebAppGetGeodata", {});
  }

  async updateStations() {
    let stations = [];

    if (DataManager.getCity())
      stations = await Database.getStations(DataManager.getCity());

    if (this._isMounted) this.setState({ stations });

    return stations;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    this.getCity();
  }

  render() {
    return this.showEpic();
  }
}

FindStations.propTypes = {
  id: PropTypes.string.isRequired,
  go: PropTypes.func.isRequired
};

export default FindStations;
