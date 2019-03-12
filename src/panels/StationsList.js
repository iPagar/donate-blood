import React from "react";
import {
  Spinner,
  Panel,
  List,
  PanelHeader,
  HeaderButton,
  View,
  Search,
  Div,
  platform,
  IOS,
  Cell
} from "@vkontakte/vkui";
import StationsListCell from "../components/StationsListCell";
import Loc from "../resources/Loc";
import Distance from "../services/Distance";
import DataManager from "../services/DataManager";

import Icon24Settings from "@vkontakte/icons/dist/24/settings";

const osname = platform();

class StationsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stations: [],
      search: ""
    };
  }

  onSearchChange = search => {
    this.setState({ search });
  };

  get stations() {
    const search = this.state.search.toLowerCase().trim();
    const filteredStations = this.props.stations.filter(
      station =>
        station.title.toLowerCase().indexOf(search) > -1 ||
        station.address.toLowerCase().indexOf(search) > -1
    );

    return filteredStations;
  }

  showPanelHeader() {
    return (
      <PanelHeader
        left={
          <HeaderButton onClick={() => this.props.history.push("findCity")}>
            <Icon24Settings />
          </HeaderButton>
        }
      >
        {Loc.FindStationsTitle}
      </PanelHeader>
    );
  }

  showStations() {
    let listStations = [];

    if (this.stations.length > 0) {
      let stations = this.stations.map(station => {
        if (this.props.geo) {
          const dist = Distance.getDistance(
            ...this.props.geo,
            station.lat,
            station.lng
          );
          station.dist = dist;
        }

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
        <Search
          value={this.state.search}
          onChange={this.onSearchChange}
          maxLength="150"
        />
        {listStations.length > 0 && <List>{listStations}</List>}
        {listStations.length === 0 && (
          <Cell>
            <Div align="center">
              {osname === IOS
                ? Loc.NothingFindText
                : Loc.NothingFindTextAndroid}
            </Div>
          </Cell>
        )}
      </React.Fragment>
    );
  }

  componentDidMount() {
    if (DataManager.getSearch())
      this.setState({ search: DataManager.getSearch() });
  }

  componentWillUnmount() {
    DataManager.setSearch(this.state.search);
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

  render() {
    return (
      <View popout={this.props.popout} activePanel="stationsList">
        <Panel id="stationsList">
          {this.showPanelHeader()}
          {this.props.stations.length > 0 && this.showStations()}
        </Panel>
      </View>
    );
  }
}

export default StationsList;
