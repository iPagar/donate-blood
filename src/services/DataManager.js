class DataManager {
  static setMapState(mapState) {
    sessionStorage.setItem("mapState", JSON.stringify(mapState));
  }

  static getMapState() {
    const mapState = JSON.parse(sessionStorage.getItem("mapState"));

    return mapState;
  }

  static setSearch(search) {
    sessionStorage.setItem("search", JSON.stringify(search));
  }

  static getSearch() {
    const search = JSON.parse(sessionStorage.getItem("search"));

    return search;
  }

  static setCity(city) {
    sessionStorage.setItem("city", JSON.stringify(city));
    this.setSearch("");
    this.setMapState(null);
  }

  static getCity() {
    const city = JSON.parse(sessionStorage.getItem("city"));

    return city;
  }

  static setUserCity(userCity) {
    sessionStorage.setItem("userCity", JSON.stringify(userCity));
  }

  static getUserCity() {
    const userCity = JSON.parse(sessionStorage.getItem("userCity"));

    return userCity;
  }

  static setGeo(lat, long) {
    const geo = JSON.stringify([Number(lat), Number(long)]);

    sessionStorage.setItem("geo", geo);
  }

  static getGeo() {
    const geo = JSON.parse(sessionStorage.getItem("geo"));

    return geo;
  }

  static setStation(station) {
    sessionStorage.setItem("station", JSON.stringify(station));
  }

  static getStation() {
    const station = JSON.parse(sessionStorage.getItem("station"));

    return station;
  }

  static setStations(stations) {
    sessionStorage.setItem("stations", JSON.stringify(stations));
  }

  static getStations() {
    const stations = JSON.parse(sessionStorage.getItem("stations"));

    return stations;
  }
}

export default DataManager;
