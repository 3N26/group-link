import { handle, Background } from '@src/utils/EventBus/background';
import { getConfig } from '@src/utils/config';

type GroupData = {
  urls: string[];
  visited: number;
  total: number;
};

async function getStorage() {
  return (await getConfig()).useLocalCache
    ? chrome.storage.local
    : chrome.storage.session;
}

handle(Background.configUpate, async (updateConfig) => {
  const currentConfig = await getConfig();
  if (currentConfig.useLocalCache !== updateConfig.useLocalCache) {
    if (updateConfig.useLocalCache) {
      const sessionData = await chrome.storage.session.get();
      await chrome.storage.local.set(sessionData);
    } else {
      const localData = await chrome.storage.local.get();
      await chrome.storage.session.set(localData);
    }
  }
});

export async function getTabGroup(key: number): Promise<GroupData | undefined> {
  const stringKey = `${key}`;
  const storage = await getStorage();
  return (await storage.get([stringKey]))[stringKey];
}

async function setTabGroup(key: number, groupData: GroupData) {
  const stringKey = `${key}`;
  const storage = await getStorage();
  return storage.set({ [stringKey]: groupData });
}

export async function removeTabGroup(key: number) {
  const stringKey = `${key}`;
  const storage = await getStorage();
  return storage.remove(stringKey);
}

export function createGroupData(urls: string[], total: number): GroupData {
  return { urls, visited: 0, total };
}

export async function updateGroupDataByStep(groupId: number, groupData: GroupData) {
  if (groupData.visited === groupData.total) {
    removeTabGroup(groupId);
  } else {
    groupData.visited += 1;
    await chrome.tabGroups.update(groupId, {
      title: `${groupData.visited}/${groupData.total}`,
    });
    setTabGroup(groupId, groupData);
  }
}
