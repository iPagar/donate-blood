import React from "react";
import VKConnect, { response as res } from "@vkontakte/vkui-connect";
import DataManager from "../services/DataManager";
import Database from "../services/Database";
import Geocode from "../services/Geocode";
import Loc from "../resources/Loc";
import {
  Epic,
  Tabbar,
  TabbarItem,
  ScreenSpinner,
  Alert
} from "@vkontakte/vkui";
import Icon28Place from "@vkontakte/icons/dist/28/place";
import Icon28Search from "@vkontakte/icons/dist/28/search";
import Icon28HelpOutline from "@vkontakte/icons/dist/28/help_outline";

import StationsList from "./StationsList";
import StationsMap from "./StationsMap";
import AboutDonation from "./AboutDonation";

// res.VKWebAppGetUserInfo.data = {
//   type: "VKWebAppGeodataResult",
//   data: {
//     available: 1,
//     lat: "55.86647",
//     long: "38.443"
//   }
// };

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
      stations: [],
      popout: null
    };
  }

  onStoryChange = e => {
    this.setState({ activeStory: e.currentTarget.dataset.story });
    this.props.history.replace("?" + e.currentTarget.dataset.story);
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
        <TabbarItem
          onClick={this.onStoryChange}
          selected={this.state.activeStory === "aboutDonation"}
          data-story="aboutDonation"
        >
          <div style={this.state.styleTabButton}>
            <Icon28HelpOutline />
          </div>
        </TabbarItem>
      </Tabbar>
    );
  };

  async setCity() {
    this.setState({ isLoading: true, popout: <ScreenSpinner /> });

    const city = await Geocode.geoToCity(DataManager.getGeo());
    DataManager.setUserCity(city);
    const cities = await Database.getCities(DataManager.getUserCity());
    if (cities.length > 0) {
      const stations = await Database.getStations(cities[0]);

      if (stations.length > 0) {
        DataManager.setCity(cities[0]);
        DataManager.setStations(stations);
        this.setState({ stations });
        this.setState({ isLoading: false, popout: null });
      } else {
        const center = await Geocode.getProvincyCenter(DataManager.getGeo());
        const cities = await Database.getCities(center);
        const stations = await Database.getStations(cities[0]);

        if (cities.length > 0 && stations.length > 0) {
          DataManager.setCity(cities[0]);
          DataManager.setStations(stations);
          this.setState({ stations });
          this.setState({ isLoading: false, popout: null });
        } else {
          this.openEmptySheet(Loc.EmptySheetTitle);
        }
      }
    } else this.openEmptySheet(Loc.EmptySheetTitle);
  }

  setStations = () => {
    this.setState({
      stations: DataManager.getStations()
    });
  };

  geoSubscribe = e => {
    switch (e.detail.type) {
      case "VKWebAppGeodataResult":
        if (e.detail.data.available) {
          DataManager.setGeo(e.detail.data.lat, e.detail.data.long);

          this.setCity();
        } else this.openEmptySheet(Loc.GetGeoError);
        break;
      case "VKWebAppGeodataFailed":
        this.openEmptySheet(Loc.GetGeoError);
        break;
      default:
        break;
    }
  };

  getCity() {
    if (DataManager.getCity() === null) {
      VKConnect.subscribe(this.geoSubscribe);
      VKConnect.send("VKWebAppGetGeodata", {});
    } else {
      this.setStations();
    }
  }

  openEmptySheet(text) {
    const { history } = this.props;

    if (this._isMounted)
      this.setState({
        popout: (
          <Alert
            actions={[
              {
                title: Loc.EmptySheetActionTitle,
                autoclose: true,
                style: "default"
              }
            ]}
            onClose={() => {
              this.setState({ popout: null });
              history.replace("findCityNecessarily");
            }}
          >
            <h2>{text}</h2>
          </Alert>
        )
      });
  }

  city = city => {
    DataManager.setStation(city);
    this.props.history.push("station");
  };

  componentWillUnmount() {
    VKConnect.unsubscribe(this.geoSubscribe);
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    if (this.props.location.search)
      this.setState({ activeStory: this.props.location.search.slice(1) });

    this.getCity();
  }

  render() {
    return (
      <Epic activeStory={this.state.activeStory} tabbar={this.showTabbar()}>
        <StationsList
          popout={this.state.popout}
          id="stationsList"
          history={this.props.history}
          stations={this.state.stations}
          city={this.city}
          geo={DataManager.getGeo()}
        />
        <StationsMap
          popout={this.state.popout}
          id="stationsMap"
          stations={this.state.stations}
          city={this.city}
        />
        <AboutDonation popout={this.state.popout} id="aboutDonation" />
      </Epic>
    );
  }
}

FindStations.propTypes = {};

export default FindStations;
