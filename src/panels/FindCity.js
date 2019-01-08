import React from "react";
import PropTypes from "prop-types";
import Database from "../services/Database";
import FindCityCell from "../components/FindCityCell";
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
  Div
} from "@vkontakte/vkui";
import Icon28ChevronBack from "@vkontakte/icons/dist/28/chevron_back";
import Icon24BrowserBack from "@vkontakte/icons/dist/24/browser_back";

const osname = platform();

class FindCity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      isLoading: false,
      cities: []
    };
  }

  onChange = search => {
    if (this._isMounted) this.setState({ search }, () => this.updateCities());
  };

  async updateCities() {
    if (this._isMounted) this.setState({ isLoading: true });

    const cities = await Database.getCities(this.state.search);

    if (this._isMounted) this.setState({ cities, isLoading: false });
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

  showCities() {
    const listCities = this.state.cities.map(city => {
      return <FindCityCell key={city.id} data={city} />;
    });

    return (
      <div>
        {listCities.length > 0 && (
          <List
            onClick={this.props.go}
            data-view="epics"
            data-panel="findStations"
          >
            {listCities}
          </List>
        )}
        {listCities.length === 0 && (
          <Div align="center">{Loc.NothingFindText}</Div>
        )}
      </div>
    );
  }

  showSearch() {
    return <Search value={this.state.search} onChange={this.onChange} />;
  }

  showPanelHeader() {
    let headerButton = (
      <HeaderButton
        onClick={this.props.go}
        data-view="epics"
        data-panel="findStations"
      >
        {osname === IOS ? <Icon28ChevronBack /> : <Icon24BrowserBack />}
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
      <Panel id={this.props.id}>
        {this.showPanelHeader()}
        {this.showSearch()}
        {!this.state.isLoading && this.showCities()}
        {this.state.isLoading && this.showSpinner()}
      </Panel>
    );
  }
}

FindCity.propTypes = {
  id: PropTypes.string.isRequired,
  go: PropTypes.func.isRequired
};

export default FindCity;
