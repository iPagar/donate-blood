import React from "react";
import PropTypes from "prop-types";
import {
  Panel,
  List,
  Button,
  Group,
  Div,
  Avatar,
  PanelHeader,
  Cell,
  View
} from "@vkontakte/vkui";
import Loc from "../resources/Loc";
import VKConnect from "@vkontakte/vkui-connect";

class Welcome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fetchedUser: null,
      userInfoDenied: false,
      centerStyle: {
        display: "flex",
        justifyContent: "center",
        textAlign: "center"
      }
    };
  }

  getUserInfo() {
    VKConnect.subscribe(e => {
      switch (e.detail.type) {
        case "VKWebAppGetUserInfoResult":
          if (this._isMounted) this.setState({ fetchedUser: e.detail.data });
          break;
        case "VKWebAppGetUserInfoFailed":
          if (this._isMounted) this.setState({ userInfoDenied: true });
          break;
        default:
          //console.log(e.detail.type);
          break;
      }
    });
    VKConnect.send("VKWebAppGetUserInfo", {});
  }

  showUser = () => {
    let { centerStyle, fetchedUser } = this.state;

    function showPhoto() {
      return (
        <Div style={centerStyle}>
          {fetchedUser.photo_200 ? (
            <Avatar src={fetchedUser.photo_200} size={80} />
          ) : null}
        </Div>
      );
    }

    function showDescription() {
      return (
        <Cell
          style={centerStyle}
          description={
            fetchedUser.city && fetchedUser.city.title
              ? fetchedUser.city.title
              : ""
          }
        >
          {`${fetchedUser.first_name} ${fetchedUser.last_name}`}
        </Cell>
      );
    }

    return (
      fetchedUser && (
        <Group>
          <Div>
            <List>
              {showPhoto()}
              {showDescription()}
            </List>
          </Div>
        </Group>
      )
    );
  };

  showInfo = () => {
    return (
      <Group>
        <Div style={this.state.centerStyle}>
          <Div>
            <Cell>
              <b>{Loc.GreetingText}</b>
            </Cell>
            <Cell multiline>{Loc.InfoText}</Cell>
          </Div>
        </Div>
      </Group>
    );
  };

  showButtons = () => {
    return (
      <Group>
        <Div>
          <Button
            size="xl"
            level="2"
            onClick={this.props.go}
            data-view="views"
            data-panel="aboutDonationFromWelcome"
          >
            {Loc.TextButtonGetInfo}
          </Button>
        </Div>
        <Div>
          <Button
            size="xl"
            level="1"
            onClick={this.props.go}
            data-view="epics"
            data-panel="findStations"
          >
            {Loc.TextButtonNext}
          </Button>
        </Div>
      </Group>
    );
  };

  showPanelHeader = () => {
    return <PanelHeader>{Loc.AppTitle}</PanelHeader>;
  };

  showUserInfoDenied() {
    return <Div>{Loc.GetDataError}</Div>;
  }

  showPanel() {
    let { id } = this.props;

    return (
      <View activePanel={id}>
        <Panel id={id}>
          {this.showPanelHeader()}
          {!this.state.userInfoDenied && this.showUser()}
          {!this.state.userInfoDenied && this.showInfo()}
          {!this.state.userInfoDenied && this.showButtons()}
          {this.state.userInfoDenied && this.showUserInfoDenied()}
        </Panel>
      </View>
    );
  }

  componentDidMount() {
    this._isMounted = true;
    this.getUserInfo();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return this.showPanel();
  }
}

Welcome.propTypes = {
  id: PropTypes.string.isRequired,
  go: PropTypes.func.isRequired,
  fetchedUser: PropTypes.shape({
    photo_200: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    city: PropTypes.shape({
      title: PropTypes.string
    })
  })
};

export default Welcome;
