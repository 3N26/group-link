import { getTabGroup, updateGroupDataByStep } from './TabGroupManage';

export async function goForwardBySender(sender: chrome.runtime.MessageSender) {
  if (!sender.tab) return;
  goForward(sender.tab);
}

export async function goForward(currentTab: chrome.tabs.Tab) {
  const groupData = await getTabGroup(currentTab.groupId);
  if (!groupData) return;
  await activeNextTab(currentTab);
  await prepareTab(currentTab, groupData.urls.shift());
  updateGroupDataByStep(currentTab.groupId, groupData);
}

async function activeNextTab(currentTab: chrome.tabs.Tab) {
  const groupTabs = await chrome.tabs.query({ groupId: currentTab.groupId });
  if (groupTabs.length === 0) return;
  const currentTabIndex = groupTabs.findIndex((tab) => tab.id === currentTab.id);
  const nextIndex = (currentTabIndex + 1) % groupTabs.length;
  const nextTabId = groupTabs[nextIndex].id as number;
  await chrome.tabs.update(nextTabId, {
    active: true,
    muted: false,
  });
}

async function prepareTab(currentTab: chrome.tabs.Tab, nextTabUrl?: string) {
  if (!currentTab.id) return;
  if (nextTabUrl) {
    await chrome.tabs.update(currentTab.id, {
      url: nextTabUrl,
      active: false,
      muted: true,
    });
  } else {
    await chrome.tabs.remove(currentTab.id);
  }
}
