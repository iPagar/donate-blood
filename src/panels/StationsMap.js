import React from "react";
import PropTypes from "prop-types";
import {
  Panel,
  PanelHeader,
  HeaderButton,
  View,
  Alert,
  Spinner
} from "@vkontakte/vkui";
import VKConnect from "@vkontakte/vkui-connect";
import { Map, Placemark, Clusterer } from "react-yandex-maps";
import DataManager from "../services/DataManager";
import Loc from "../resources/Loc";
import Geocode from "../services/Geocode";

import Icon24Locate from "@vkontakte/icons/dist/24/locate";

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
      geo: "",
      zoom: 12,
      isLoading: true,
      isLoadingMap: true,
      userGeo: "",
      isPanning: false,
      stations: ""
    };
  }

  geoSubscribe = async e => {
    switch (e.detail.type) {
      case "VKWebAppGeodataResult":
        if (e.detail.data.available) {
          DataManager.setGeo(e.detail.data.lat, e.detail.data.long);
          const city = await Geocode.geoToCity(DataManager.getGeo());
          DataManager.setUserCity(city);
          this.setState({ userGeo: DataManager.getGeo(), isPanning: true });
          this.state.map
            .panTo(this.state.userGeo)
            .then(() => this.setState({ isPanning: false }));
        } else {
          DataManager.setGeo(null, null);
          this.setState({ userGeo: DataManager.getGeo() });
          DataManager.setUserCity(null);
          this.setState({
            popout: (
              <Alert
                actions={[
                  {
                    title: "Ок",
                    autoclose: true,
                    style: "primary"
                  }
                ]}
                onClose={() => this.setState({ popout: null })}
              >
                <h2>Геопозиция отключена</h2>
                <p>Включите геопозицию в настройках Вашего телефона</p>
              </Alert>
            )
          });
        }
        break;
      case "VKWebAppGeodataFailed":
        this.setState({
          popout: (
            <Alert
              actions={[
                {
                  title: "Ок",
                  autoclose: true,
                  style: "primary"
                }
              ]}
              onClose={() => this.setState({ popout: null })}
            >
              <p>Не удалось получить геопозицию</p>
            </Alert>
          )
        });
        break;
      default:
        break;
    }
  };

  onClickHeaderButton = () => {
    VKConnect.subscribe(this.geoSubscribe);
    VKConnect.send("VKWebAppGetGeodata", {});
  };

  showPanelHeader() {
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
  }

  setMapRef = map => {
    if (this._isMounted) this.setState({ map });
  };

  setPlacemarks() {
    const stations = this.props.stations.map((station, i) => (
      <Placemark
        key={i}
        onClick={() => {
          this.props.city(station);
        }}
        geometry={[station.lat, station.lng]}
        options={{
          iconLayout: "default#image",
          iconImageHref:
            "https://raw.githubusercontent.com/iPagar/donate-blood/master/src/img/heart.png",
          iconImageSize: [36, 36],
          iconImageOffset: [-18, -36]
        }}
      />
    ));

    this.setState({ Stations: stations });
  }

  mapOnLoad = () => {
    this.setState({ isLoadingMap: false });
  };

  showMap() {
    const { geo, zoom, Stations, isLoading, isLoadingMap } = this.state;

    const mapState = {
      center: geo,
      zoom: zoom
    };
    const mapOptions = {
      yandexMapDisablePoiInteractivity: true,
      suppressMapOpenBlock: true
    };

    return (
      <div style={this.state.styleMap}>
        {isLoadingMap && this.showSpinner()}
        {!isLoading && (
          <Map
            style={this.state.styleMap}
            defaultState={mapState}
            defaultOptions={mapOptions}
            instanceRef={this.setMapRef}
            onLoad={this.mapOnLoad}
          >
            <Clusterer
              options={{
                preset: "islands#redClusterIcons",
                clusterIconColor: "#f60808",
                groupByCoordinates: false,
                useMapMargin: true,
                gridSize: 128,
                margin: 10,
                hasBalloon: false,
                hasHint: false,
                zoomMargin: 36
              }}
            >
              {Stations.map(station => station)}
            </Clusterer>
            <Placemark
              geometry={this.state.userGeo}
              options={{
                preset: "islands#geolocationIcon",
                iconColor: "#f60808"
              }}
            />
          </Map>
        )}
      </div>
    );
  }

  async setGeo() {
    this.setState({ isLoading: true });
    const actualMapState = DataManager.getMapState();

    if (actualMapState) {
      //не меняем карту
      this.setState({ geo: actualMapState.center });
      this.setState({ zoom: actualMapState.zoom });
    } else if (DataManager.getCity().title === DataManager.getUserCity()) {
      //показываем геопозицию пользователя
      this.setState({ geo: DataManager.getGeo(), zoom: 14 });
    } else {
      //показываем на центр города
      let geo = await Geocode.addressToGeo(DataManager.getCity().title);

      this.setState({
        geo,
        zoom: 12
      });
    }
    this.setState({ userGeo: DataManager.getGeo(), isLoading: false });
  }

  setMap() {
    if (this.state.map) {
      let mapState = {
        center: this.state.map.getCenter(),
        zoom: this.state.map.getZoom()
      };

      DataManager.setMapState(mapState);
    }
  }

  showSpinner() {
    return (
      <div
        style={{
          position: "absolute",
          margin: "auto",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0
        }}
      >
        <Spinner size="medium" />
      </div>
    );
  }

  componentWillUnmount() {
    VKConnect.unsubscribe(this.geoSubscribe);
    this.setMap();
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    this.setGeo();
    this.setPlacemarks();
  }

  render() {
    return (
      <View popout={this.state.popout} activePanel="stationsMap">
        <Panel id="stationsMap" centered>
          {this.showPanelHeader()}
          {this.showMap()}
        </Panel>
      </View>
    );
  }
}

StationsMap.propTypes = {
  stations: PropTypes.array.isRequired
};

export default StationsMap;
