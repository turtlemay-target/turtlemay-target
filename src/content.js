import * as React from "react";
import * as ReactDOM from "react-dom";
import { Application } from "../components/Application";

const elem = document.createElement("div");
elem.className = "turtlemay__root";
document.body.append(elem);
ReactDOM.render(React.createElement(Application), elem);
