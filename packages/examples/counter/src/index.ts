import { render } from "solid-js/web";
import { App } from "./App";

const container = document.createElement("div");

render(App, container);

document.body.appendChild(container);
