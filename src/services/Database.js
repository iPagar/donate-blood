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

        stations = stations.filter(
            station =>
                !(
                    station.title.toLowerCase().indexOf("закрыта") !== -1 ||
                    station.title.toLowerCase().indexOf("закрыто") !== -1
                )
        );

        // stations = await Promise.all(
        //     stations.map(async station => {
        //         if (station.address.search(/;/g) !== -1)
        //             station.address = station.address
        //                 .split("")
        //                 .reverse()
        //                 .join("")
        //                 .split(";")[0]
        //                 .split("")
        //                 .reverse()
        //                 .join("");

        //         let geo;
        //         if (city.country.title === "Россия") {
        //             geo = await (await fetch(
        //                 `https://cors.io/?http://search.maps.sputnik.ru/search/addr?q=${(city
        //                     .country.title,
        //                 city.title)}`
        //             )).json();

        //             if (geo.result.address) {
        //                 let lat =
        //                     geo.result.address[0].features[0].geometry
        //                         .geometries[0].coordinates[1];
        //                 let lng =
        //                     geo.result.address[0].features[0].geometry
        //                         .geometries[0].coordinates[0];

        //                 if (
        //                     Distance.getDistance(
        //                         lat,
        //                         lng,
        //                         station.lat,
        //                         station.lng
        //                     ) < 1
        //                 ) {
        //                     geo = await (await fetch(
        //                         `https://cors.io/?http://search.maps.sputnik.ru/search/addr?q=${
        //                             city.country.title
        //                         },${city.title},${station.address}`
        //                     )).json();
        //                     lat =
        //                         geo.result.address[0].features[0].geometry
        //                             .geometries[0].coordinates[1];
        //                     lng =
        //                         geo.result.address[0].features[0].geometry
        //                             .geometries[0].coordinates[0];
        //                     station.lat = lat;
        //                     station.lng = lng;
        //                 }
        //             }
        //         } else {
        //             geo = await Geocode.addressToGeo(
        //                 city.country.title + "," + city.title
        //             );

        //             if (
        //                 Distance.getDistance(
        //                     geo[0],
        //                     geo[1],
        //                     station.lat,
        //                     station.lng
        //                 ) < 0.25
        //             ) {
        //                 geo = await Geocode.addressToGeo(
        //                     city.country.title +
        //                         "," +
        //                         city.title +
        //                         "," +
        //                         station.address
        //                 );

        //                 station.lat = geo[0];
        //                 station.lng = geo[1];
        //             }
        //         }

        //         return station;
        //     })
        // );

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
