import React from "react";
import PropTypes from "prop-types";
import Database from "../services/Database";
import FindCityCell from "../components/FindCityCell";
import DataManager from "../services/DataManager";
import Loc from "../resources/Loc";
import {
  Panel,
  PanelHeader,
  HeaderButton,
  platform,
  IOS,
  Search,
  List,
  Spinner,
  Div,
  View,
  Cell,
  Alert,
  ScreenSpinner
} from "@vkontakte/vkui";

import Icon24Back from "@vkontakte/icons/dist/24/back";
const osname = platform();

class FindCity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      isLoading: false,
      cities: [],
      popout: null
    };
  }

  onChange = async search => {
    if (this._isMounted) {
      await this.setState({ search });
      await this.updateCities();
    }
  };

  async updateCities() {
    await this.setState({ isLoading: true });

    const cities = await Database.getCities(this.state.search);

    await this.setState({ cities, isLoading: false });
  }

  componentDidMount() {
    this._isMounted = true;
    this.updateCities();
  }

  componentWillUnmount() {
    this._isMounted = false;
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

  onCellClick = async data => {
    this.setState({ popout: <ScreenSpinner /> });
    const stations = await Database.getStations(data);

    if (stations.length > 0) {
      if (this._isMounted) {
        DataManager.setCity(data);
        DataManager.setStations(stations);
      }
      if (this.props.necessarily) this.props.history.push("findStations");
      else this.props.history.goBack();
    } else this.openEmptySheet(Loc.EmptySheetTitle);

    this.setState({ popout: null });
  };

  openEmptySheet(text) {
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
          >
            <h2>{text}</h2>
          </Alert>
        )
      });
  }

  showCities() {
    const listCities = this.state.cities.map(city => {
      return (
        <FindCityCell key={city.id} data={city} onClick={this.onCellClick} />
      );
    });

    return (
      <React.Fragment>
        {listCities.length > 0 && <List>{listCities}</List>}
        {listCities.length === 0 && (
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

  showSearch() {
    return (
      <Search
        value={this.state.search}
        onChange={this.onChange}
        maxLength="30"
      />
    );
  }

  showPanelHeader() {
    let headerButton = (
      <HeaderButton onClick={this.props.history.goBack}>
        {osname === IOS ? "Отмена" : <Icon24Back />}
      </HeaderButton>
    );

    if (this.props.necessarily) headerButton = " ";

    return (
      <PanelHeader noShadow left={headerButton}>
        {Loc.FindCityTitle}
      </PanelHeader>
    );
  }

  render() {
    return (
      <View activePanel="findCityPanel" popout={this.state.popout}>
        <Panel id="findCityPanel">
          {this.showPanelHeader()}
          {this.showSearch()}
          {!this.state.isLoading && this.showCities()}
          {this.state.isLoading && this.showSpinner()}
        </Panel>
      </View>
    );
  }
}

FindCity.propTypes = {
  history: PropTypes.object.isRequired
};

export default FindCity;
