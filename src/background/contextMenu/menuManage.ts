type Menu = {
  id: string;
  handler?: (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => any;
} & chrome.contextMenus.CreateProperties;

const MenuMap = new Map<string, Menu>();

export function registMenu(menu: Menu) {
  MenuMap.set(menu.id, menu);
  // return {
  //   update: (updateProperties: chrome.contextMenus.UpdateProperties) => {
  //     return chrome.contextMenus.update(menu.id, updateProperties);
  //   },
  // };
}

chrome.runtime.onInstalled.addListener(() => {
  MenuMap.forEach(({ handler, ...menu }) => {
    chrome.contextMenus.create(menu);
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  MenuMap.get(info.menuItemId as string)?.handler?.(info, tab);
});
