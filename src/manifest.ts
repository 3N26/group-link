import packageJson from '../package.json';

/**
 * After changing, please reload the extension at `chrome://extensions`
 */
const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  // options_page: "options/index.html",
  background: {
    service_worker: 'background/index.js',
    type: 'module',
  },
  action: {
    default_popup: 'popup/index.html',
    default_icon: 'icon.png',
  },
  // chrome_url_overrides: {
  //   newtab: "pages/newtab/index.html",
  // },
  permissions: ['tabs', 'tabGroups', 'activeTab', 'history', 'storage', 'contextMenus'],
  icons: {
    '128': 'icon.png',
  },
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*', '<all_urls>'],
      js: ['content/index.js'],
      // KEY for cache invalidation
      // css: ["assets/css/contentStyle<KEY>.chunk.css"],
    },
  ],
  web_accessible_resources: [
    {
      resources: ['assets/js/*.js', 'assets/css/*.css', 'icon.png'],
      matches: ['*://*/*'],
    },
  ],
};

export default manifest;
