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
  Cell,
  Button,
  Avatar,
  Group
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
        {listStations.length > 0 && (
          <List>
            {
              // <Group style={{ margin: 0 }} title="Информационный блок">
              //   <Cell
              //     before={
              //       <Avatar
              //         size={80}
              //         type="image"
              //         src="https://image.freepik.com/free-icon/no-translate-detected_318-49740.jpg"
              //       />
              //     }
              //     size="m"
              //     multiline
              //     description={
              //       <div>
              //         <div>
              //           Это настоящий кладезь знаний по заработку на партнерках,
              //           по полочкам оформленный в книгу.
              //         </div>
              //         <div style={{ marginTop: "8px" }}>
              //           <Button
              //             onClick={() => {
              //               fetch(
              //                 "https://ipagar.asuscomm.com:8084/?url=https://pu.vk.com/c848636/upload.php?_query=eyJ0aW1lIjoiMjAxOTA1MjUwMiIsImFwaV9pZCI6MzI2NTgwMiwidiI6IjUuOTUiLCJhY3QiOiJkb19hZGQiLCJtZXRob2QiOiJzdG9yaWVzIiwiYWlkIjotODEsIm1pZCI6Njc2MDI3ODcsIm9pZCI6Njc2MDI3ODcsImdpZCI6MCwic3Rvcmllc191cGxvYWRfaGFzaCI6ImMyOGE2NThjNjQyYTIzYWRjOGY5ZjVlODJhNDY3MzZhIiwic2VydmVyIjo4NDg2MzYsIl9vcmlnaW4iOiJodHRwczpcL1wvdmsuY29tIiwiX3NpZyI6IjM2NDQ5YzU2ZjI3MTIxZDc3NWU5NDk1ZmNlNDBiMTg3In0"
              //               )
              //                 .then(function(res) {
              //                   console.log(res);
              //                 })
              //                 .catch(function(res) {
              //                   console.log(res);
              //                 });
              //             }}
              //           >
              //             Получить книгу!
              //           </Button>
              //         </div>
              //       </div>
              //     }
              //   >
              //     Как делать деньги из дома с пошаговым планом заработка 1000$ в
              //     месяц
              //   </Cell>
              // </Group>
            }
            {listStations}
          </List>
        )}
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
