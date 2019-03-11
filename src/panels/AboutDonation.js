import React from "react";
import PropTypes from "prop-types";
import Topic from "../components/Topic";
import Topics from "../resources/Topics";
import { Panel, PanelHeader, Group, List, View } from "@vkontakte/vkui";

import Loc from "../resources/Loc";

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

  showPanelHeader() {
    return <PanelHeader>{Loc.SettingsAboutTitle}</PanelHeader>;
  }

  render() {
    return (
      <View activePanel="aboutDonationPanel">
        <Panel id="aboutDonationPanel">
          {this.showPanelHeader()}
          {this.showTopics()}
        </Panel>
      </View>
    );
  }
}

About.propTypes = {
  welcome: PropTypes.bool
};

export default About;
