import React from "react";
import VKConnect from "@vkontakte/vkui-connect";
import { Root, View } from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import "./resources/ui.css";
import { Route, withRouter } from "react-router-dom";
import "./app.css";

import FindStations from "./panels/FindStations";
import FindCity from "./panels/FindCity";
import Station from "./panels/Station";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: false };
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
          break;
      }
    });
  }

  async setInitialView() {
    await this.setState({ isLoading: true });

    this.props.history.replace("findStations");

    await this.setState({ isLoading: false });
  }

  componentDidMount() {
    this.setInitialView();
    this.getTheme();
  }

  render() {
    const { isLoading } = this.state;
    const activeView = this.props.location.pathname.slice(1);

    return (
      <div style={{ width: "100%", height: "100%" }}>
        {!isLoading && (
          <Root activeView={activeView}>
            <Route id="findStations" component={FindStations} />
            <Route id="station" component={Station} />
            <Route id="findCity" component={FindCity} />
            <Route
              id="findCityNecessarily"
              render={() => (
                <View activePanel="findCityPanel">
                  <FindCity
                    id="findCityPanel"
                    history={this.props.history}
                    necessarily
                  />
                </View>
              )}
            />
          </Root>
        )}
      </div>
    );
  }
}

export default withRouter(App);
