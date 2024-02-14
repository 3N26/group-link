import { getConfig } from '@src/utils/config';
import { Background, invoke } from '../utils/EventBus/content';
import { getCloseUrls } from './getCloseUrls';
import { isHitKeyboardCombo, isHitMouseCombo } from '@src/utils/combo';

window.addEventListener(
  'keydown',
  (e) => {
    getConfig()
      .then(({ nextLinkHotKey }) => {
        if (isHitKeyboardCombo(nextLinkHotKey, e)) {
          e.preventDefault();
          invoke(Background.goForward);
        }
      })
      .catch();
  },
  { passive: true, capture: true }
);

window.addEventListener(
  'mousedown',
  (e) => {
    getConfig()
      .then(({ nextLinkHotKey }) => {
        if (isHitMouseCombo(nextLinkHotKey, e)) {
          e.preventDefault();
          invoke(Background.goForward);
        }
      })
      .catch();
  },
  { capture: true }
);

// window.addEventListener(
//   'click',
//   (e) => {
//     if (!e.altKey) return;
//     const urls = getCloseUrls(e.target);
//     if (urls.length > 0) {
//       e.preventDefault();
//       invoke(Background.startVisit, urls);
//     }
//   },
//   {
//     // passive: true,
//     capture: true,
//   }
// );

window.addEventListener(
  'contextmenu',
  (e) => {
    const dom = e.target as HTMLElement;
    let urls = getCloseUrls(dom);
    if (urls.length == 0) return;
    getConfig()
      .then(({ limitOpenLinkCount }) => {
        if (limitOpenLinkCount > 0) {
          const url = dom.closest('a')?.href;
          if (url) {
            const offset = urls.includes(url) ? urls.indexOf(url) : 0;
            urls = urls.splice(offset, limitOpenLinkCount);
          }
        }
        invoke(Background.updateLinks, urls);
      })
      .catch();
  },
  { passive: true, capture: true }
);
