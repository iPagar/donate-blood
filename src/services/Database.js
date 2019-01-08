import firebase from "firebase/app";
import "firebase/firestore";

import Api from "../configs/Api.json";

class Database {
  static get config() {
    const config = {
      apiKey: Api.apiKey,
      projectId: Api.ProjectId
    };

    return config;
  }

  static init() {
    if (!firebase.apps.length) {
      firebase.initializeApp(this.config);
      firebase.firestore();
      firebase.firestore().settings({
        timestampsInSnapshots: true
      });
    }
  }

  static get firestore() {
    const db = firebase.app().firestore();
    return db;
  }

  static async getStations(city) {
    let stations = {};
    const cityId = city.id;
    const wrapAPIKey = Api.wrapAPIKey;
    const request = `https://wrapapi.com/use/iPagar/blood/stations/latest?city_id=${cityId}&wrapAPIKey=${wrapAPIKey}`;

    const response = await fetch(request);
    const json = await response.json();

    stations = json.data.stations;

    return stations;
  }

  static async getCities(title) {
    let cities = {};
    const wrapAPIKey = Api.wrapAPIKey;
    const request = `https://wrapapi.com/use/iPagar/blood/cities/latest?title=${title}&wrapAPIKey=${wrapAPIKey}`;

    const response = await fetch(request);
    const json = await response.json();

    cities = json.data.cities.filter(city => {
      return city.country.title === "Россия";
    });

    return cities;
  }

  static async checkCity(city) {
    let result = false;
    const citiesData = await this.getCities(city);

    if (!citiesData.empty) result = true;

    return result;
  }

  static async getTopics() {
    const topicsData = await this.firestore.collection("topics").get();

    let topics = [];
    await topicsData.forEach(topic => topics.push(topic.data()));

    return topics;
  }
}

export default Database;
