import Api from "../configs/Api.json";

async function geoToCity(geo) {
  const apiKey = Api.ApiYandex;
  const kind = "locality";
  const format = "json";
  const sco = "latlong";
  const request = `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&sco=${sco}&results=1&format=${format}&kind=${kind}&geocode=${geo}`;

  const response = await fetch(request);
  const json = await response.json();

  const cityTitle =
    json.response.GeoObjectCollection.featureMember[0].GeoObject.name;

  return cityTitle;
}

async function addressToGeo(address) {
  const apiKey = Api.ApiYandex;
  const format = "json";
  const request = `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&results=1&format=${format}&geocode=${address}`;

  const response = await fetch(request);
  const json = await response.json();
  const geoData = JSON.stringify(
    json.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
  )
    .substr(1, 17)
    .split(" ");
  const geo = [geoData[1], geoData[0]];

  return geo;
}

export default { geoToCity, addressToGeo };
