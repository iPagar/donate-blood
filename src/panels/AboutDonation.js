import React from "react";
import PropTypes from "prop-types";
import Topic from "../components/Topic";
import Topics from "../resources/Topics";
import {
  Panel,
  PanelHeader,
  HeaderButton,
  platform,
  IOS,
  Group,
  List
} from "@vkontakte/vkui";

import Icon28ChevronBack from "@vkontakte/icons/dist/28/chevron_back";
import Icon24BrowserBack from "@vkontakte/icons/dist/24/browser_back";
import Icon24Done from "@vkontakte/icons/dist/24/done";

import Loc from "../resources/Loc";

const osname = platform();

class About extends React.Component {
  showTopics() {
    const topics = Topics.map((topic, i) => {
      return <Topic key={i} data={topic} />;
    });
    return (
      <Group>
        <List>{topics}</List>
      </Group>
    );
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

  render() {
    return (
      <Panel id={this.props.id}>
        {this.showPanelHeader()}
        {this.showTopics()}
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
