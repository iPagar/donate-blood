import React from "react";
import VKConnect from "@vkontakte/vk-bridge";
import VKConnectPromise from "@vkontakte/vk-bridge";
import DataManager from "../services/DataManager";
import Database from "../services/Database";
import Geocode from "../services/Geocode";
import Loc from "../resources/Loc";
import {
  View,
  Panel,
  Epic,
  Tabbar,
  TabbarItem,
  ScreenSpinner,
  Alert,
  Button,
  Link,
} from "@vkontakte/vkui";
import Icon28Place from "@vkontakte/icons/dist/28/place";
import Icon28Search from "@vkontakte/icons/dist/28/search";
import Icon28HelpOutline from "@vkontakte/icons/dist/28/help_outline";
import Icon16Clear from "@vkontakte/icons/dist/16/clear";

import StationsList from "./StationsList";
import StationsMap from "./StationsMap";
import AboutDonation from "./AboutDonation";
import PopupView from "../components/PopupView";

// res.VKWebAppGetUserInfo.data = {
//   type: "VKWebAppGeodataResult",
//   data: {
//     available: 1,
//     lat: "55.86647",
//     long: "38.443"
//   }
// };

let isCancelled = false;
let timeToShow;
let isActive = false;

class FindStations extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeView: "findStations",
      activeStory: "stationsList",
      isLoading: false,
      styleTabButton: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      },
      stations: [],
      popout: null,
    };
    this.buttonRef = React.createRef();
  }

  onStoryChange = (e) => {
    this.setState({ activeStory: e.currentTarget.dataset.story });
    this.props.history.replace("?" + e.currentTarget.dataset.story);
  };

  showTabbar = () => {
    return (
      <Tabbar>
        <TabbarItem
          onClick={this.onStoryChange}
          selected={this.state.activeStory === "stationsList"}
          data-story="stationsList"
        >
          <div style={this.state.styleTabButton}>
            <Icon28Search />
          </div>
        </TabbarItem>
        <TabbarItem
          onClick={this.onStoryChange}
          selected={this.state.activeStory === "stationsMap"}
          data-story="stationsMap"
        >
          <div style={this.state.styleTabButton}>
            <Icon28Place />
          </div>
        </TabbarItem>
        <TabbarItem
          onClick={this.onStoryChange}
          selected={this.state.activeStory === "aboutDonation"}
          data-story="aboutDonation"
        >
          <div style={this.state.styleTabButton}>
            <Icon28HelpOutline />
          </div>
        </TabbarItem>
      </Tabbar>
    );
  };

  async setCity() {
    this.setState({ isLoading: true, popout: <ScreenSpinner /> });

    const city = await Geocode.geoToCity(DataManager.getGeo());
    DataManager.setUserCity(city);
    const cities = await Database.getCities(DataManager.getUserCity());
    if (cities.length > 0) {
      const stations = await Database.getStations(cities[0]);

      if (stations.length > 0) {
        DataManager.setCity(cities[0]);
        DataManager.setStations(stations);
        this.setState({ stations });
        this.setState({ isLoading: false, popout: null });
      } else {
        const center = await Geocode.getProvincyCenter(DataManager.getGeo());
        const cities = await Database.getCities(center);
        const stations = await Database.getStations(cities[0]);

        if (cities.length > 0 && stations.length > 0) {
          DataManager.setCity(cities[0]);
          DataManager.setStations(stations);
          this.setState({ stations });
          this.setState({ isLoading: false, popout: null });
        } else {
          this.openEmptySheet(Loc.EmptySheetTitle);
        }
      }
    } else this.openEmptySheet(Loc.EmptySheetTitle);
  }

  setStations = () => {
    this.setState({
      stations: DataManager.getStations(),
    });
  };

  geoSubscribe = (e) => {
    switch (e.detail.type) {
      case "VKWebAppGeodataResult":
        if (e.detail.data.available) {
          DataManager.setGeo(e.detail.data.lat, e.detail.data.long);

          this.setCity();
        } else this.openEmptySheet(Loc.GetGeoError);
        break;
      case "VKWebAppGeodataFailed":
        this.openEmptySheet(Loc.GetGeoError);
        break;
      default:
        break;
    }
  };

  getCity() {
    if (DataManager.getCity() === null) {
      VKConnect.subscribe(this.geoSubscribe);
      VKConnect.send("VKWebAppGetGeodata", {});
    } else {
      this.setStations();
    }
  }

  openEmptySheet(text) {
    const { history } = this.props;

    if (this._isMounted)
      this.setState({
        popout: (
          <Alert
            actions={[
              {
                title: Loc.EmptySheetActionTitle,
                autoclose: true,
                style: "default",
              },
            ]}
            onClose={() => {
              this.setState({ popout: null });
              history.replace("findCityNecessarily");
            }}
          >
            <h2>{text}</h2>
          </Alert>
        ),
      });
  }

  city = (city) => {
    DataManager.setStation(city);
    this.props.history.push("station");
  };

  componentWillUnmount() {
    VKConnect.unsubscribe(this.geoSubscribe);
    clearTimeout(timeToShow);
    this._isMounted = false;
  }

  // showButton = () => {
  //   if (!this.state.popout) {
  //     this.buttonRef.current.classList.add("show");
  //     isActive = true;
  //   }
  // };

  async componentDidMount() {
    this._isMounted = true;
    if (this.props.location.search)
      this.setState({ activeStory: this.props.location.search.slice(1) });

    this.getCity();
    this.loadPopupView();

    // this.loadButton();
  }

  loadPopupView() {
    // if (!isCancelled) {
    //   timeToShow = setTimeout(this.showPopupView, 5000);
    // }
  }

  popupError = () => {
    this.setState({
      popout: (
        <Alert
          actions={[
            {
              title: "Ок",
              autoclose: true,
              style: "default",
            },
          ]}
          onClose={() => this.setState({ popout: null })}
        >
          Ошибка
        </Alert>
      ),
    });
  };

  subToPublic = () => {
    VKConnectPromise.send("VKWebAppJoinGroup", { group_id: 177443119 });
    this.setState({ popout: null });
  };

  popupSuccess = () => {
    this.setState({
      popout: (
        <Alert
          actions={[
            {
              title: "Хорошо",
              action: this.subToPublic,
              style: "default",
            },
            {
              title: "Отмена",
              autoclose: true,
              style: "cancel",
            },
          ]}
          actionsLayout="vertical"
          onClose={() => {
            this.setState({ popout: null });
          }}
        >
          Будьте в курсе всех событий, связанных с донорством крови -
          подпишитесь на нас!
        </Alert>
      ),
    });
  };

  showPopupView = () => {
    if (!this.state.isLoading)
      this.setState({
        popout: (
          <PopupView
            title="Всемирный день донора"
            onClose={() => {
              this.setState({ popout: null });
              isCancelled = true;
            }}
            bottom={
              <Button
                size="xl"
                onClick={() => {
                  isCancelled = true;
                  this.setState({ popout: <ScreenSpinner /> });
                  VKConnectPromise.send("VKWebAppGetAuthToken", {
                    app_id: 6783775,
                    scope: "stories",
                  })
                    .then((data) => {
                      let token = data.data.access_token;
                      VKConnectPromise.send("VKWebAppCallAPIMethod", {
                        method: "stories.getPhotoUploadServer",
                        params: {
                          add_to_news: 1,
                          link_url: "https://vk.com/app6783775",
                          v: "5.95",
                          access_token: token,
                        },
                      })
                        .then((resp) => {
                          const url = resp.data.response.upload_url;
                          fetch(`https://ipagar.asuscomm.com:8084/?url=${url}`)
                            .then(this.popupSuccess)
                            .catch(this.popupError);
                        })
                        .catch(this.popupError);
                    })
                    .catch(this.popupError);
                }}
              >
                Поделиться историей!
              </Button>
            }
          >
            <p>
              Сегодя - всемирный день донора крови. Миллионы людей благодаря
              донорской безопасной крови продолжают жить. Донор - дарит жизнь
              тому, кто нуждается в переливании крови.
            </p>

            <img
              src="https://i.ibb.co/GpmMXjH/s-Vfck52-Mo-QI.jpg"
              style={{ width: "100%" }}
              alt="Донорство крови"
              border="0"
            />
          </PopupView>
        ),
      });
  };

  // loadButton() {
  //   if (!isCancelled && !isActive)
  //     timeToShow = setTimeout(this.showButton, 5000);
  //   else if (isActive && !isCancelled)
  //     this.buttonRef.current.style.bottom = "calc(var(--tabbar_height) + 5px)";
  // }

  render() {
    return (
      <React.Fragment>
        <Epic activeStory={this.state.activeStory} tabbar={this.showTabbar()}>
          <StationsList
            popout={this.state.popout}
            id="stationsList"
            history={this.props.history}
            stations={this.state.stations}
            city={this.city}
            geo={DataManager.getGeo()}
          />
          <StationsMap
            popout={this.state.popout}
            id="stationsMap"
            stations={this.state.stations}
            city={this.city}
          />
          <AboutDonation popout={this.state.popout} id="aboutDonation" />
        </Epic>
        {
          // {!this.state.isLoading &&
          //   всплывающая кнопка
          // <div
          //   style={{
          //     position: "fixed",
          //     display: "flex",
          //     alignItems: "center",
          //     justifyContent: "center",
          //     bottom: "0",
          //     width: "100%",
          //     zIndex: 1
          //   }}
          //   ref={this.buttonRef}
          // >
          //   <Button
          //     style={{
          //       position: "flex"
          //     }}
          //     after={
          //       <div
          //         onClick={() => {
          //           this.buttonRef.current.classList.remove("show");
          //           this.buttonRef.current.classList.add("hide");
          //           isCancelled = true;
          //         }}
          //       >
          //         <Icon16Clear />
          //       </div>
          //     }
          //   >
          //     <div
          //       onClick={() => {
          //         this.buttonRef.current.classList.remove("show");
          //         this.buttonRef.current.classList.add("hide");
          //         isCancelled = true;
          //       }}
          //     >
          //       <Link
          //         href="https://vk.com/donateblood?w=wall-177443119_20"
          //         target="_blank"
          //       >
          //         <div style={{ color: "var(--button_primary_foreground)" }}>
          //           Какова польза для организма?
          //         </div>
          //       </Link>
          //     </div>
          //   </Button>
          // </div>
          // }
        }
      </React.Fragment>
    );
  }
}

FindStations.propTypes = {};

export default FindStations;
