import React from "react";
import PropTypes from "prop-types";
import {
  Spinner,
  Panel,
  Group,
  List,
  PanelHeader,
  HeaderButton
} from "@vkontakte/vkui";
import StationsListCell from "../components/StationsListCell";
import Loc from "../resources/Loc";
import Distance from "../services/Distance";
import DataManager from "../services/DataManager";

import Icon24Settings from "@vkontakte/icons/dist/24/settings";

class StationsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };
  }

  showPanelHeader = () => {
    return (
      <PanelHeader
        left={
          <HeaderButton
            onClick={this.props.go}
            data-view="views"
            data-panel="settings"
          >
            <Icon24Settings />
          </HeaderButton>
        }
      >
        {Loc.FindStationsTitle}
      </PanelHeader>
    );
  };

  showStations() {
    let listStations = [];

    if (this.props.stations.length > 0) {
      let stations = this.props.stations.map(station => {
        const dist = Distance.getDistance(
          DataManager.getGeo()[0],
          DataManager.getGeo()[1],
          station.lat,
          station.lng
        );
        station.dist = dist;

        return station;
      });

      stations.sort((a, b) => {
        if (a.dist > b.dist) {
          return 1;
        }
        if (a.dist < b.dist) {
          return -1;
        }

        return 0;
      });

      listStations = stations.map((station, i) => {
        return (
          <StationsListCell key={i} data={station} city={this.props.city} />
        );
      });
    }

    return (
      <React.Fragment>
        {listStations.length > 0 && (
          <Group>
            <List>{listStations}</List>
          </Group>
        )}
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

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
  }

  render() {
    return (
      <Panel id={this.props.id}>
        {this.showPanelHeader()}
        {!this.state.isLoading && this.showStations()}
        {this.state.isLoading && this.showSpinner()}
      </Panel>
    );
  }
}

StationsList.propTypes = {
  id: PropTypes.string.isRequired
};

export default StationsList;
