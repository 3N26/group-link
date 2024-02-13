import { Background, handle } from '@src/utils/EventBus/background';
import { registMenu } from '../menuManage';
import { tabConsoleLog } from '@src/utils/console/background';
import { startVisit } from '../../handler/startVisit';
import { isFulfilled } from '@src/utils/common';

registMenu({
  id: 'groupUnvisitedLink',
  title: 'Group unvisited links',
  contexts: ['link', 'image', 'video', 'audio'],
  handler: openunvisitedLink,
});

const resolved = Promise.resolve<string[]>([]);

let filterUnvisitedLinkPromise = resolved;

async function openunvisitedLink() {
  const unvisitedLinks = await filterUnvisitedLinkPromise;
  filterUnvisitedLinkPromise = resolved;
  if (unvisitedLinks.length > 0) {
    startVisit(unvisitedLinks);
  }
}

handle(Background.updateLinks, async (urls: string[]) => {
  filterUnvisitedLinkPromise = Promise.allSettled(
    urls.map((url) => chrome.history.getVisits({ url }))
  ).then((settledResult) => {
    const unvisitedLinks = new Set<string>();
    settledResult.forEach((item, index) => {
      if (isFulfilled(item) && item.value.length === 0) {
        unvisitedLinks.add(urls[index]);
      }
    });
    return [...unvisitedLinks];
  });
});
