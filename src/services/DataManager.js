class DataManager {
  static setCity(city) {
    sessionStorage.setItem("city", JSON.stringify(city));
  }

  static getCity() {
    const city = JSON.parse(sessionStorage.getItem("city"));

    return city;
  }

  static setGeo(lat, long) {
    const geo = JSON.stringify([Number(lat), Number(long)]);

    sessionStorage.setItem("geo", geo);
  }

  static getGeo() {
    const geo = JSON.parse(sessionStorage.getItem("geo"));

    return geo;
  }

  static clear() {
    sessionStorage.clear();
  }
}

export default DataManager;
