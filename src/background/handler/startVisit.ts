import { getConfig } from '@src/utils/config';
import { allFulfilledSettled } from '@src/utils/common';
import { createGroupData, updateGroupDataByStep } from './TabGroupManage';

async function getUrlGroup(urls: string[]) {
  const { tabPoolCount } = await getConfig();
  const cacheUrls = urls.slice(0, tabPoolCount);
  const restUrls = urls.slice(tabPoolCount);
  return [cacheUrls, restUrls] as const;
}

async function groupTabByUrls(urls: string[]) {
  const tabs = await allFulfilledSettled(
    urls.map((url, index) => chrome.tabs.create({ url, active: index === 0 }))
  );
  return await chrome.tabs.group({
    tabIds: tabs.map((tab) => tab.id as number),
  });
}

export async function startVisit(urls: string[]) {
  const [cacheUrls, restUrls] = await getUrlGroup(urls);
  const groupId = await groupTabByUrls(cacheUrls);
  const groupData = createGroupData(restUrls, urls.length);
  updateGroupDataByStep(groupId, groupData);
}
