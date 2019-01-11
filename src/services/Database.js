import Api from "../configs/Api.json";

class Database {
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
}

export default Database;
