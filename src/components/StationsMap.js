import React from "react";
import { YMaps, Map, Placemark } from "react-yandex-maps";

class StationsMap extends React.Component {
  constructor() {
    this.state = { routeLength: null };
  }

  componentDidMount() {
    this._isMounted = true;

    this.props.ymaps.require(["Map", "Placemark"], function(Map, Placemark) {
      // Adding the class manually to the global viewport, since this doesn't happen when using the module system's "require" method.
      YMaps.Map = Map;
      var map = new YMaps.Map("map", {
          center: [55.76, 37.64],
          zoom: 10
        }),
        // The Placemark class wasn't added to the public viewport.
        placemark = new Placemark([55.55, 37.0]);
      map.geoObjects.add(placemark);
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return this.state.routeLength == null ? (
      <p>Loading route...</p>
    ) : (
      <p>This route is {this.state.routeLength} long</p>
    );
  }
}

export default StationsMap;
