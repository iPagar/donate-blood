import React from "react";
import PropTypes from "prop-types";
import { YMaps, Map, Placemark } from "react-yandex-maps";
import {
  Panel,
  HeaderButton,
  PanelHeader,
  View,
  Group,
  Cell,
  List,
  Link,
  Spinner
} from "@vkontakte/vkui";
import Loc from "../resources/Loc";
import DataManager from "../services/DataManager";

import { findNumbers } from "libphonenumber-js";

import Icon24Place from "@vkontakte/icons/dist/24/place";
import Icon24Globe from "@vkontakte/icons/dist/24/globe";
import Icon24Phone from "@vkontakte/icons/dist/24/phone";
import Icon24Recent from "@vkontakte/icons/dist/24/recent";

class Station extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      styleMap: {
        display: "flex",
        flexGrow: "1",
        width: "100%"
      },
      isLoading: true
    };
  }

  showPanelHeader = () => {
    return (
      <PanelHeader
        left={
          <HeaderButton onClick={this.props.go} data-panel="findStations">
            Отменить
          </HeaderButton>
        }
      >
        {Loc.StationTitle}
      </PanelHeader>
    );
  };

  mapOnLoad = () => {
    this.setState({ isLoading: false });
  };

  showMap() {
    const zoom = 14;

    const mapState = {
      center: [this.props.data.lat, this.props.data.lng],
      zoom: zoom
    };

    const mapOptions = {
      suppressMapOpenBlock: true
    };

    return (
      <div style={this.state.styleMap}>
        <YMaps>
          <Map
            defaultOptions={mapOptions}
            width="inherit"
            height="300px"
            defaultState={mapState}
            onLoad={this.mapOnLoad}
          >
            <Placemark geometry={[this.props.data.lat, this.props.data.lng]} />
            <Placemark
              geometry={DataManager.getGeo()}
              options={{ preset: "islands#redCircleIcon" }}
            />
          </Map>
        </YMaps>
      </div>
    );
  }

  showSite() {
    return (
      <React.Fragment>
        {this.props.data.site.length > 0 && (
          <Group title="Сайт">
            <List>
              <Cell before={<Icon24Globe />}>
                <Link href={this.props.data.site}>{this.props.data.site}</Link>
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
        {this.props.data.email.length > 0 && (
          <Group title="E-mail">
            <List>
              <Cell before={<Icon24Globe />}>
                <Link href={this.props.data.site}>{this.props.data.site}</Link>
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
        {this.props.data.worktime.length > 0 && (
          <Group title="Время работы">
            <List>
              <Cell multiline before={<Icon24Recent />}>
                {this.props.data.worktime}
              </Cell>
            </List>
          </Group>
        )}
      </React.Fragment>
    );
  }

  showTel() {
    return (
      <React.Fragment>
        {this.props.data.phones.length > 0 && (
          <Group title="Контакты">
            <List>
              <Cell multiline before={<Icon24Phone />}>
                <Link
                  href={`tel:${
                    findNumbers(this.props.data.phones, "RU", {
                      v2: true
                    })[0].number.number
                  }`}
                >
                  {this.props.data.phones}
                </Link>
              </Cell>
            </List>
          </Group>
        )}
      </React.Fragment>
    );
  }

  showAddress() {
    return (
      <Group title={this.props.data.title}>
        <List>
          <Cell multiline before={<Icon24Place />}>
            <Link
              href={`http://maps.yandex.ru/?text=${
                this.props.data.city.title
              }, ${this.props.data.address}`}
            >
              {this.props.data.address}
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

  showPanel() {
    return (
      <View activePanel={this.props.id}>
        <Panel id={this.props.id}>
          {this.showPanelHeader()}
          {this.showMap()}
          {!this.state.isLoading && this.showInfo()}
          {this.state.isLoading && this.showSpinner()}
        </Panel>
      </View>
    );
  }

  render() {
    return this.showPanel();
  }
}

Station.propTypes = {
  id: PropTypes.string.isRequired,
  go: PropTypes.func.isRequired,
  data: PropTypes.shape({
    address: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  })
};

export default Station;
