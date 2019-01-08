import React from "react";
import PropTypes from "prop-types";
import { Panel, PanelHeader, HeaderButton, Spinner } from "@vkontakte/vkui";
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
      zoom: 12
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
          >
            {this.showPlacemarks()}
            <Placemark
              geometry={DataManager.getGeo()}
              options={{ preset: "islands#redCircleIcon" }}
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

  showSpinner() {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column"
        }}
      >
        <Spinner size="medium" style={{ marginTop: 20 }} />
      </div>
    );
  }

  componentWillUnmount() {
    this._isMounted = false;
    actualMapState.center = this.state.map.getCenter();
    actualMapState.zoom = this.state.map.getZoom();
    actualMapState.cityId = DataManager.getCity().id;
  }

  componentDidMount() {
    this._isMounted = true;
    this.setGeo();
  }

  render() {
    return (
      <Panel id={this.props.id} centered={true}>
        {this.showPanelHeader()}
        {!this.state.isLoading && this.showMap()}
        {this.state.isLoading && this.showSpinner()}
      </Panel>
    );
  }
}

StationsMap.propTypes = {
  id: PropTypes.string.isRequired,
  stations: PropTypes.shape.isRequired
};

export default StationsMap;
