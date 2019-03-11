import "core-js/es6/map";
import "core-js/es6/set";
import React from "react";
import ReactDOM from "react-dom";
import connect from "@vkontakte/vkui-connect";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { YMaps } from "react-yandex-maps";

// Init VK App
connect.send("VKWebAppInit", {});

ReactDOM.render(
	<HashRouter>
		<YMaps>
			<App />
		</YMaps>
	</HashRouter>,
	document.getElementById("root")
);
