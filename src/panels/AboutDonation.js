import React from "react";
import PropTypes from "prop-types";
import Topic from "../components/Topic";
import Database from "../services/Database";
import {
  Panel,
  PanelHeader,
  HeaderButton,
  platform,
  IOS,
  Group,
  Div,
  List,
  Spinner
} from "@vkontakte/vkui";

import Icon28ChevronBack from "@vkontakte/icons/dist/28/chevron_back";
import Icon24BrowserBack from "@vkontakte/icons/dist/24/browser_back";
import Icon24Done from "@vkontakte/icons/dist/24/done";

import Loc from "../resources/Loc";

const osname = platform();

class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      topics: []
    };
  }

  showTopics() {
    if (this.state.topics.length > 0) {
      const newsTemplate = this.state.topics.map(function(topic) {
        return <Topic key={topic.id} data={topic} />;
      });
      return (
        <Group>
          <List>{newsTemplate}</List>
        </Group>
      );
    } else {
      return <Div align="center">{Loc.NothingFindText}</Div>;
    }
  }

  async getTopics() {
    if (this._isMounted) this.setState({ isLoading: true });

    const topics = await Database.getTopics();

    if (this._isMounted) this.setState({ topics, isLoading: false });
  }

  setButton() {
    let button = (
      <HeaderButton
        onClick={this.props.go}
        data-view="views"
        data-panel="settings"
      >
        {osname === IOS ? <Icon28ChevronBack /> : <Icon24BrowserBack />}
      </HeaderButton>
    );

    if (this.props.welcome)
      button = (
        <HeaderButton
          onClick={this.props.go}
          data-panel="findStations"
          data-view="epics"
        >
          <Icon24Done />
        </HeaderButton>
      );

    return button;
  }

  showPanelHeader() {
    let button = this.setButton();

    return <PanelHeader left={button}>{Loc.SettingsAboutTitle}</PanelHeader>;
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
    this.getTopics();
  }

  render() {
    return (
      <Panel id={this.props.id}>
        {this.showPanelHeader()}
        {!this.state.isLoading && this.showTopics()}
        {this.state.isLoading && this.showSpinner()}
      </Panel>
    );
  }
}

About.propTypes = {
  id: PropTypes.string.isRequired,
  go: PropTypes.func.isRequired,
  welcome: PropTypes.bool
};

export default About;
