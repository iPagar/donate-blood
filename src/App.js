import React from "react";
import VKConnect from "@vkontakte/vkui-connect";
import { View, Root } from "@vkontakte/vkui";
import DataManager from "./services/DataManager";
import Database from "./services/Database";
import "@vkontakte/vkui/dist/vkui.css";

import Welcome from "./panels/Welcome";
import FindStations from "./panels/FindStations";
import Settings from "./panels/Settings";
import FindCity from "./panels/FindCity";
import About from "./panels/About";
import AboutDonation from "./panels/AboutDonation";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activePanel: "welcome",
      activeView: "views"
    };
  }

  getTheme() {
    VKConnect.subscribe(e => {
      switch (e.detail.type) {
        case "VKWebAppUpdateConfig":
          let schemeAttribute = document.createAttribute("scheme");
          schemeAttribute.value = e.detail.data.scheme
            ? e.detail.data.scheme
            : "client_light";
          document.body.attributes.setNamedItem(schemeAttribute);
          break;
        default:
          //console.log(e.detail.type);
          break;
      }
    });
  }

  checkCity() {
    const city = DataManager.getCity();

    if (city != null) {
      this.setState({ activeView: "epics", activePanel: "findStations" });
    }
  }

  componentWillUnmount() {
    DataManager.clear();
  }

  go = e => {
    this.setState({ activeView: e.currentTarget.dataset.view });
    if (e.currentTarget.dataset.panel)
      this.setState({ activePanel: e.currentTarget.dataset.panel });
  };

  showViews = () => {
    return (
      <View id="views" activePanel={this.state.activePanel}>
        <Welcome id="welcome" go={this.go} />
        <Settings id="settings" go={this.go} />
        <FindCity id="findCity" go={this.go} />
        <About id="about" go={this.go} />
        <AboutDonation id="aboutDonation" go={this.go} />
        <AboutDonation
          id="aboutDonationFromWelcome"
          go={this.go}
          welcome={true}
        />
      </View>
    );
  };

  showEpic = () => {
    return (
      <div id="epics" style={{ height: "100%", width: "100%" }}>
        <FindStations id="findStations" go={this.go} />
      </div>
    );
  };

  showRoot = () => {
    return (
      <Root activeView={this.state.activeView}>
        {this.showEpic()}
        {this.showViews()}
      </Root>
    );
  };

  componentDidMount() {
    this.getTheme();
    this.checkCity();
    Database.init();
  }

  render() {
    return this.showRoot();
  }
}

export default App;
