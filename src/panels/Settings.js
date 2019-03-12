import React from "react";
import PropTypes from "prop-types";
import Loc from "../resources/Loc";
import DataManager from "../services/DataManager";
import {
  Panel,
  PanelHeader,
  HeaderButton,
  Group,
  Div,
  List,
  Cell
} from "@vkontakte/vkui";
import Icon24Globe from "@vkontakte/icons/dist/24/globe";
import Icon24Place from "@vkontakte/icons/dist/24/place";
import Icon24Info from "@vkontakte/icons/dist/24/info";
import Icon24Services from "@vkontakte/icons/dist/24/services";

class Settings extends React.Component {
  showPanelHeader() {
    return (
      <PanelHeader
        left={
          <HeaderButton
            onClick={this.props.go}
            data-panel="findStations"
            data-view="epics"
          >
            <Icon24Globe />
          </HeaderButton>
        }
      >
        {Loc.SettingsTitle}
      </PanelHeader>
    );
  }

  showList() {
    return (
      <Group>
        <Div>
          <List>
            <Cell
              expandable
              onClick={this.props.go}
              data-view="views"
              data-panel="findCity"
              before={<Icon24Place />}
              indicator={
                <div style={{ lineHeight: "24px" }}>
                  {DataManager.getCity() && DataManager.getCity().title}
                </div>
              }
            >
              {Loc.SettingsFindCItyTitle}
            </Cell>
            <Cell
              expandable
              onClick={this.props.go}
              data-view="views"
              data-panel="aboutDonation"
              before={<Icon24Info />}
            >
              {Loc.SettingsAboutTitle}
            </Cell>
            <Cell
              expandable
              onClick={this.props.go}
              data-view="views"
              data-panel="about"
              before={<Icon24Services />}
            >
              {Loc.SettingsContactsTitle}
            </Cell>
          </List>
        </Div>
      </Group>
    );
  }

  render() {
    return (
      <Panel id={this.props.id}>
        {this.showPanelHeader()}
        {this.showList()}
      </Panel>
    );
  }
}

Settings.propTypes = {
  id: PropTypes.string.isRequired,
  go: PropTypes.func.isRequired
};

export default Settings;
