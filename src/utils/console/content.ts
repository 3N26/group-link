import { Background, handle } from "../EventBus/content";

handle(Background.log, (args) => console.log("background: ", ...args));
