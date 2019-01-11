import React from "react";
import PropTypes from "prop-types";
import { Panel, PanelHeader, HeaderButton } from "@vkontakte/vkui";
import { YMaps, Map, Placemark } from "react-yandex-maps";
import DataManager from "../services/DataManager";
import Loc from "../resources/Loc";
import Geocode from "../services/Geocode";

import Icon24Locate from "@vkontakte/icons/dist/24/locate";

let actualMapState = {
  cityId: null,
  center: null,
  zoom: 12
};

class StationsMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      styleMap: {
        display: "flex",
        flexGrow: "1",
        width: "100%"
      },
      map: null,
      zoom: 12,
      isLoading: true
    };
  }

  onClickHeaderButton = () => {
    this.state.map.panTo(DataManager.getGeo());
  };

  showPanelHeader = () => {
    return (
      <PanelHeader
        left={
          <HeaderButton onClick={this.onClickHeaderButton}>
            <Icon24Locate />
          </HeaderButton>
        }
      >
        {Loc.FindStationsTitle}
      </PanelHeader>
    );
  };

  showPlacemarks() {
    const stations = this.props.stations.map((station, i) => {
      return (
        <Placemark
          key={i}
          onClick={() => this.props.city(station)}
          geometry={[station.lat, station.lng]}
          options={{
            iconLayout: "default#image",
            iconImageHref:
              "https://raw.githubusercontent.com/iPagar/donate-blood/master/src/img/heart.png",
            iconImageSize: [36, 36],
            iconImageOffset: [-36, -18]
          }}
        />
      );
    });

    return stations;
  }

  setMapRef = map => {
    if (this._isMounted) this.setState({ map });
  };

  showMap() {
    const mapState = {
      center: this.state.geo,
      zoom: this.state.zoom
    };

    const mapOptions = {
      suppressMapOpenBlock: true
    };

    return (
      <div style={this.state.styleMap}>
        <YMaps>
          <Map
            width="inherit"
            height="inherit"
            defaultState={mapState}
            instanceRef={this.setMapRef}
            defaultOptions={mapOptions}
            onLoad={() => this.setState({ isLoading: false })}
          >
            {this.showPlacemarks()}
            <Placemark
              geometry={DataManager.getGeo()}
              options={{
                preset: "islands#circleIcon",
                iconColor: "#f60808"
              }}
            />
          </Map>
        </YMaps>
      </div>
    );
  }

  async setGeo() {
    if (actualMapState.cityId === DataManager.getCity().id) {
      this.setState({ geo: actualMapState.center });
      this.setState({ zoom: actualMapState.zoom });
    } else {
      const geo = await Geocode.addressToGeo(DataManager.getCity().title);
      this.setState({
        geo
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    if (!this.state.isLoading) {
      actualMapState.center = this.state.map.getCenter();
      actualMapState.zoom = this.state.map.getZoom();
      actualMapState.cityId = DataManager.getCity().id;
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this.setGeo();
  }

  render() {
    return (
      <Panel id={this.props.id} centered={true}>
        {this.showPanelHeader()}
        {this.showMap()}
      </Panel>
    );
  }
}

StationsMap.propTypes = {
  id: PropTypes.string.isRequired,
  stations: PropTypes.array.isRequired
};

export default StationsMap;
