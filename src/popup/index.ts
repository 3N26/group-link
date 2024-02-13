import { Background, invoke } from '@src/utils/EventBus/popup';
import { resolveCombo, resolveKeyboardCombo, resolveMouseCombo } from '@src/utils/combo';
import { getConfig, setConfig } from '@src/utils/config';

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('form') as HTMLFormElement;
  const tabPoolCountInput = document.getElementById('tabPoolCount') as HTMLInputElement;
  const nextTabShortcut = document.getElementById('nextTabShortcut') as HTMLInputElement;
  const moreBtn = document.getElementById('moreBtn') as HTMLDivElement;
  const moreOptionsDiv = document.getElementById('moreOptions') as HTMLDivElement;
  const limitToggle = document.getElementById('limitToggle') as HTMLInputElement;
  const cacheToggle = document.getElementById('cacheToggle') as HTMLInputElement;
  const tabLimit = document.getElementById('tabLimit') as HTMLInputElement;

  async function initConfig() {
    const config = await getConfig();
    tabPoolCountInput.value = `${config.tabPoolCount}`;
    nextTabShortcut.value = resolveCombo(config.nextLinkHotKey);
  }

  moreBtn.addEventListener('click', () => {
    const isHidden = moreOptionsDiv.style.height === '0px';
    moreOptionsDiv.style.height = isHidden ? 'auto' : '0px';
    if (isHidden) {
      moreBtn.style.display = 'block';
      getConfig().then((config) => {
        if (config.limitOpenLinkCount > 0) {
          limitToggle.checked = true;
          tabLimit.value = `${config.limitOpenLinkCount}`;
          tabLimit.style.display = 'block';
        } else {
          limitToggle.checked = false;
          tabLimit.style.display = 'none';
        }
        cacheToggle.checked = config.useLocalCache;
      });
    } else {
      moreBtn.style.removeProperty('display');
    }
  });

  limitToggle.addEventListener('change', (e) => {
    if (limitToggle.checked) {
      getConfig().then((config) => {
        if (config.limitOpenLinkCount > 0) {
          tabLimit.value = `${config.limitOpenLinkCount}`;
        }
      });
      tabLimit.style.display = 'block';
    } else {
      tabLimit.style.display = 'none';
    }
  });

  initConfig();

  form.addEventListener('change', updateConfig);
  useCombon(updateConfig);

  function updateConfig() {
    const limitToggle = document.getElementById('limitToggle') as HTMLInputElement;
    const cacheToggle = document.getElementById('cacheToggle') as HTMLInputElement;
    const tabLimit = document.getElementById('tabLimit') as HTMLInputElement;
    const config: any = {
      tabPoolCount: +tabPoolCountInput.value,
      limitOpenLinkCount: limitToggle.checked ? +tabLimit.value : 0,
      useLocalCache: !!cacheToggle.checked,
    };
    const combo = nextTabShortcut.getAttribute('data-combo');
    if (combo) {
      config.nextLinkHotKey = combo;
    }
    setConfig(config);
    invoke(Background.configUpate, config);
  }
});

function useCombon(onUpdate: () => void) {
  const elHotkey = document.getElementById('nextTabShortcut') as HTMLInputElement;

  const debounce = function (fn: Function) {
    var nTimer: number;
    return function (this: any) {
      var that = this,
        aArgs = arguments,
        delayed = function () {
          fn.apply(that, aArgs);
        };
      window.clearTimeout(nTimer);
      nTimer = window.setTimeout(delayed, 50);
    };
  };

  const handleHotkeyDown = debounce(function (e: KeyboardEvent) {
    e.stopPropagation();
    const combo = resolveKeyboardCombo(e);
    elHotkey.value = combo.showCombo;
    elHotkey.setAttribute('data-combo', combo.value);
  });

  function handleHotkeyUp(e: KeyboardEvent) {
    e.stopPropagation();
    elHotkey.blur();
    onUpdate();
  }

  function resetHotkey() {
    elHotkey.placeholder = 'Set hotkey combo';
    const temp = elHotkey.getAttribute('data-temp');
    if (temp && !elHotkey.value) {
      elHotkey.value = temp;
    }
  }

  function updateHotkey() {
    elHotkey.placeholder = 'Keyboard or mouse';
    elHotkey.setAttribute('data-temp', elHotkey.value);
    elHotkey.value = '';
  }

  function handleMouseDown(e: MouseEvent) {
    if (elHotkey.value) return;
    const data = resolveMouseCombo(e);
    elHotkey.value = data.showCombo;
    elHotkey.setAttribute('data-combo', data.value);
  }

  function handleMouseUp(e: MouseEvent) {
    const mouseComb = elHotkey.getAttribute('data-combo');
    if (mouseComb) {
      onUpdate();
    }
  }

  elHotkey.addEventListener('blur', resetHotkey, { capture: true });
  elHotkey.addEventListener('focus', updateHotkey, { capture: true });
  elHotkey.addEventListener('keyup', handleHotkeyUp, { capture: true });
  elHotkey.addEventListener('keydown', handleHotkeyDown, { capture: true });
  elHotkey.addEventListener('mousedown', handleMouseDown, { capture: true });
  elHotkey.addEventListener('mousedown', handleMouseUp, { capture: true });
}
