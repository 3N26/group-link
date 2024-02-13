import type { Sender } from '../types';
import type { Channel } from './Channel';

type Handler = (data: any, sender: Sender) => any;

const handlerMap = new Map<
  Channel,
  {
    handler: Handler;
    needResponse: boolean;
  }[]
>();

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  const { channel, data } = message;

  const handlers = handlerMap.get(channel);
  if (!handlers) return;
  for (const { handler, needResponse } of handlers) {
    const result = handler(data, sender);
    if (needResponse) {
      if (result instanceof Promise) {
        result.then(sendResponse);
        return true;
      } else {
        sendResponse(result);
      }
    }
  }
});

export function handle(channel: Channel, handler: Handler, needResponse = false) {
  const handlers = handlerMap.get(channel) || [];
  handlers.push({ handler, needResponse });
  handlerMap.set(channel, handlers);
}
