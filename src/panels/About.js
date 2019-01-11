import React from "react";
import PropTypes from "prop-types";
import {
  Panel,
  PanelHeader,
  HeaderButton,
  platform,
  IOS,
  Group,
  Div,
  List,
  Cell,
  Link
} from "@vkontakte/vkui";
import Icon28ChevronBack from "@vkontakte/icons/dist/28/chevron_back";
import Icon24BrowserBack from "@vkontakte/icons/dist/24/browser_back";
import Icon24LogoVk from "@vkontakte/icons/dist/24/logo_vk";

const osname = platform();

const About = props => (
  <Panel id={props.id}>
    <PanelHeader
      left={
        <HeaderButton
          onClick={props.go}
          data-view="views"
          data-panel="settings"
        >
          {osname === IOS ? <Icon28ChevronBack /> : <Icon24BrowserBack />}
        </HeaderButton>
      }
    >
      Меню
    </PanelHeader>
    <Group>
      <Div>
        <List>
          <Cell before={<Icon24LogoVk />}>
            <Link href="https://vk.com/ipagar" target="_blank">
              Павел Гараев
            </Link>
          </Cell>
        </List>
      </Div>
    </Group>
  </Panel>
);

About.propTypes = {
  id: PropTypes.string.isRequired,
  go: PropTypes.func.isRequired
};

export default About;
