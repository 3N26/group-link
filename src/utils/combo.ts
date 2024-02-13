const isMac = navigator.platform.indexOf('Mac') > -1;

export function resolveKeyboardCombo(e: KeyboardEvent) {
  const combo: string[] = [];
  if (e.ctrlKey) combo.push('Ctrl');
  if (e.shiftKey) combo.push('Shift');
  if (e.altKey) combo.push(isMac ? 'Option' : 'Alt');
  if (e.metaKey) combo.push(isMac ? '⌘' : 'Win');
  if (combo.length > 0) {
    combo.push(e.key.length > 1 ? e.key : e.key.toUpperCase());
  }
  const comboString = combo.join(' + ');
  return {
    showCombo: comboString,
    value: `keyboard:${comboString}`,
  };
}

export function isHitKeyboardCombo(combo: string, e: KeyboardEvent) {
  if (!combo.startsWith('keyboard:')) return false;
  return combo === resolveKeyboardCombo(e).value;
}

export function resolveMouseCombo(e: MouseEvent) {
  const data = JSON.stringify({
    button: e.button,
    buttons: e.buttons,
    detail: e.detail,
  });
  return {
    showCombo: 'Mouse Combo',
    value: `mouse:${data}`,
  };
}

export function isHitMouseCombo(combo: string, e: MouseEvent) {
  if (!combo.startsWith('mouse:')) return false;
  return combo === resolveMouseCombo(e).value;
}

export function resolveCombo(combo: string) {
  if (combo.startsWith('mouse:')) {
    return 'Mouse Combo';
  }
  if (combo.startsWith('keyboard:')) {
    return combo.slice('keyboard:'.length);
  }
  return '';
}
