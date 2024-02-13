import type { Channel } from './Channel';

export function invoke(channel: Channel, data?: any) {
  console.log('content invoke: ', channel);
  // use null-safe operator since chrome.runtime
  // is lazy inited and might return undefined
  if (chrome.runtime?.id) {
    return chrome.runtime.sendMessage({ channel, data });
  } else {
    console.warn('chrome.runtime not inited');
    return null;
  }
}

export * from './Channel';
export { handle } from './handler';
