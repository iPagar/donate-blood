import Api from "../configs/Api.json";
import Geocode from "./Geocode";

class Database {
  static async getStations(city) {
    let stations = {};
    const cityId = city.id;
    const wrapAPIKey = Api.wrapAPIKey;
    const request = `https://wrapapi.com/use/iPagar/blood/stations/latest?city_id=${cityId}&wrapAPIKey=${wrapAPIKey}`;

    const response = await fetch(request);
    const json = await response.json();

    stations = json.data.stations;

    stations = stations.filter(
      station =>
        !(
          station.title.toLowerCase().indexOf("закрыта") !== -1 ||
          station.title.toLowerCase().indexOf("закрыто") !== -1
        )
    );

    stations = await Promise.all(
      stations.map(async station => {
        const geo = await Geocode.addressToGeo(
          city.title + ", " + station.address
        );
        station.lat = geo ? geo[0] : station.lat;
        station.lng = geo ? geo[1] : station.lng;
        return station;
      })
    );

    return stations;
  }

  static async getCities(title) {
    let cities = {};
    const wrapAPIKey = Api.wrapAPIKey;
    const request = `https://wrapapi.com/use/iPagar/blood/cities/latest?title=${title
      .replace(/^[A-Za-z0-9]+$/, "")
      .trim()}&wrapAPIKey=${wrapAPIKey}`;

    const response = await fetch(request);
    const json = await response.json();

    cities = json.data ? json.data.cities : [];
    return cities;
  }
}

export default Database;
