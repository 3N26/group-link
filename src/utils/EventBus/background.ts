import type { Channel } from './Channel';

export async function invoke(channel: Channel, data?: any) {
  console.log('background invoke: ', channel);
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  if (!tab.id) return;
  return chrome.tabs.sendMessage(tab.id, { channel, data });
}

export * from './Channel';
export { handle } from './handler';
