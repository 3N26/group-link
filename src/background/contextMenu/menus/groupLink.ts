import { Background, handle } from '@src/utils/EventBus/background';
import { registMenu } from '../menuManage';
import { tabConsoleLog } from '@src/utils/console/background';
import { startVisit } from '../../handler/startVisit';

registMenu({
  id: 'groupLink',
  title: 'Group links',
  contexts: ['link', 'image', 'video', 'audio'],
  handler: openLink,
});

let links: string[] = [];

export function openLink() {
  tabConsoleLog('links', links);
  if (links.length > 0) {
    startVisit(links);
    links = [];
  }
}

handle(Background.updateLinks, (urls: string[]) => {
  tabConsoleLog('urls');
  tabConsoleLog('urls', urls);
  links = urls;
});
