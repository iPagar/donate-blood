import React from "react";
import { Map, Placemark } from "react-yandex-maps";
import {
  Panel,
  HeaderButton,
  PanelHeader,
  View,
  Group,
  Cell,
  List,
  Link,
  Spinner,
  platform,
  IOS
} from "@vkontakte/vkui";
import Icon24Back from "@vkontakte/icons/dist/24/back";
import Loc from "../resources/Loc";
import DataManager from "../services/DataManager";

import { findNumbers } from "libphonenumber-js";

import Icon24Place from "@vkontakte/icons/dist/24/place";
import Icon24Globe from "@vkontakte/icons/dist/24/globe";
import Icon24Phone from "@vkontakte/icons/dist/24/phone";
import Icon24Recent from "@vkontakte/icons/dist/24/recent";

const osname = platform();

class Station extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      styleMap: {
        display: "flex",
        justifyContent: "center",
        alignContent: "space-between",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
        height: "300px"
      },
      isLoadingMap: true,
      station: DataManager.getStation()
    };
  }

  showPanelHeader() {
    const { history } = this.props;

    return (
      <PanelHeader
        left={
          <HeaderButton onClick={history.goBack}>
            {osname === IOS ? "Отмена" : <Icon24Back />}
          </HeaderButton>
        }
      >
        {Loc.StationTitle}
      </PanelHeader>
    );
  }

  mapOnLoad = () => {
    this.setState({ isLoadingMap: false });
  };

  showMap() {
    const zoom = 16;

    const mapState = {
      center: [this.state.station.lat, this.state.station.lng],
      zoom: zoom
    };

    const mapOptions = {
      yandexMapDisablePoiInteractivity: true,
      suppressMapOpenBlock: true
    };

    return (
      <div>
        {this.state.isLoadingMap && this.showSpinner()}
        <Map
          defaultOptions={mapOptions}
          style={this.state.styleMap}
          defaultState={mapState}
          onLoad={this.mapOnLoad}
        >
          <Placemark
            geometry={[this.state.station.lat, this.state.station.lng]}
            options={{
              iconLayout: "default#image",
              iconImageHref:
                "https://raw.githubusercontent.com/iPagar/donate-blood/master/src/img/heart.png",
              iconImageSize: [36, 36],
              iconImageOffset: [-18, -36]
            }}
          />
          <Placemark
            geometry={DataManager.getGeo()}
            options={{
              preset: "islands#geolocationIcon",
              iconColor: "#f60808"
            }}
          />
        </Map>
      </div>
    );
  }

  showSite() {
    return (
      <React.Fragment>
        {this.state.station.site.length > 0 && (
          <Group title="Сайт">
            <List>
              <Cell multiline before={<Icon24Globe />}>
                <Link
                  href={
                    this.state.station.site.includes("http")
                      ? `${this.state.station.site}`
                      : `//${this.state.station.site}`
                  }
                  target="_blank"
                >
                  {this.state.station.site}
                </Link>
              </Cell>
            </List>
          </Group>
        )}
      </React.Fragment>
    );
  }

  showEmail() {
    return (
      <React.Fragment>
        {this.state.station.email.length > 0 && (
          <Group title="E-mail">
            <List>
              <Cell multiline before={<Icon24Globe />}>
                <Link href={this.state.station.site}>
                  {this.state.station.site}
                </Link>
              </Cell>
            </List>
          </Group>
        )}
      </React.Fragment>
    );
  }

  showWorkTime() {
    return (
      <React.Fragment>
        {this.state.station.worktime.length > 0 && (
          <Group title="Время работы">
            <List>
              <Cell multiline before={<Icon24Recent />}>
                {this.state.station.worktime}
              </Cell>
            </List>
          </Group>
        )}
      </React.Fragment>
    );
  }

  showTel() {
    let tels = [];
    if (this.state.station.phones.length > 0)
      findNumbers(this.state.station.phones, "RU", {
        v2: true
      }).map(tel => tels.push(tel.number.formatNational()));

    return (
      <React.Fragment>
        {tels.length > 0 && (
          <Group title="Контакты">
            <List>
              {tels.map((tel, i) => (
                <Cell key={i} before={<Icon24Phone />}>
                  <Link href={`tel:${tel}`}>{tel}</Link>
                </Cell>
              ))}
            </List>
          </Group>
        )}
      </React.Fragment>
    );
  }

  showAddress() {
    return (
      <Group title={this.state.station.title}>
        <List>
          <Cell multiline before={<Icon24Place />}>
            <Link
              href={
                osname === IOS
                  ? `yandexmaps://maps.yandex.ru/?text=${
                      this.state.station.city.title
                    }, ${this.state.station.address}`
                  : `//maps.yandex.ru/?text=${this.state.station.city.title}, ${
                      this.state.station.address
                    }`
              }
            >
              {this.state.station.address}
            </Link>
          </Cell>
        </List>
      </Group>
    );
  }

  showInfo() {
    return (
      <React.Fragment>
        {this.showAddress()}
        {this.showWorkTime()}
        {this.showTel()}
        {this.showSite()}
      </React.Fragment>
    );
  }

  showSpinner() {
    return (
      <div style={this.state.styleMap}>
        <Spinner size="medium" />
      </div>
    );
  }

  render() {
    return (
      <View activePanel="station">
        <Panel id="station">
          {this.showPanelHeader()}
          {this.showMap()}
          {this.showInfo()}
        </Panel>
      </View>
    );
  }
}

export default Station;
