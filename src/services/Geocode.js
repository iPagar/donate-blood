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

  const geoData = json.response.GeoObjectCollection.featureMember[0]
    ? JSON.stringify(
        json.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
      )
        .substr(1, 17)
        .split(" ")
    : null;

  const geo = geoData ? [geoData[1], geoData[0]] : null;

  return geo;
}

async function getProvincyCenter(geo) {
  const apiKey = Api.ApiYandex;
  const kind = "locality";
  const format = "json";
  const sco = "latlong";
  const request = `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&sco=${sco}&results=1&format=${format}&kind=${kind}&geocode=${geo}`;

  const response = await fetch(request);
  const json = await response.json();

  const oblast =
    json.response.GeoObjectCollection.featureMember[0].GeoObject
      .metaDataProperty.GeocoderMetaData.AddressDetails.Country
      .AdministrativeArea.AdministrativeAreaName;

  const request1 = `https://nominatim.openstreetmap.org/search?q=${oblast}&polygon=1&addressdetails=1&format=jsonv2`;

  const response1 = await fetch(request1);
  const json1 = await response1.json();
  const cityTitle1 = json1[1].address.state;

  return cityTitle1;
}

export default { geoToCity, addressToGeo, getProvincyCenter };
