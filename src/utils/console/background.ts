import { invoke } from "../EventBus/background";
import { Background } from "../EventBus/Channel";

export function tabConsoleLog(...args: any[]) {
  invoke(Background.log, args);
}
