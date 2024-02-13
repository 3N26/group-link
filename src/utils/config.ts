const key = 'GROUP_LINK_CONFIG';

const defaultConfig = {
  tabPoolCount: 3,
  nextLinkHotKey: 'Shift + ArrowRight',
  limitOpenLinkCount: 0,
  useLocalCache: false,
};

type Config = typeof defaultConfig;

export async function getConfig(): Promise<Config> {
  const config = (await chrome.storage.local.get([key]))[key];
  return { ...defaultConfig, ...config };
}

export async function setConfig(config: Partial<Config>) {
  const cfg = { ...(await getConfig()), ...config };
  if (isNaN(cfg.tabPoolCount)) {
    cfg.tabPoolCount = defaultConfig.tabPoolCount;
  } else {
    cfg.tabPoolCount = Math.max(1, cfg.tabPoolCount);
  }
  if (isNaN(cfg.limitOpenLinkCount)) {
    cfg.limitOpenLinkCount = defaultConfig.limitOpenLinkCount;
  } else {
    cfg.limitOpenLinkCount = Math.max(0, cfg.limitOpenLinkCount);
  }

  await chrome.storage.local.set({ [key]: cfg });

  return cfg;
}
