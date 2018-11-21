'use strict';

const fs = require('fs');

function getMetaInfo(key) {
  let result;
  if (process.env.META_FILE_PATH) {
    const metaFilePath = process.env.META_FILE_PATH + '/ac-metaInfo';
    if (fs.existsSync(metaFilePath)) {
      const data = fs.readFileSync(metaFilePath);
      try {
        const metaInfo = JSON.parse(data);
        if (metaInfo[key]) {
          const urls = metaInfo[key].split(',');
          if (urls.length > 0) {
            result = urls[Math.floor(Math.random() * urls.length)];
          }
        }
      } catch (error) {
        // Do nothing
      }
    }
  }
  return result;
}

const BLOBSTORE_SERVICE_NAME = 'zc-blobstore';
const BLOBSTORE_SERVICE_VERSION = 1;
const UPLOADFILE_NAME = 'uploadFileInfo';
const UPLOADFILE_VERSION = 2;
const UPLOADFILE_ACCESS_TYPE = 'public';
const UPLOADFILE_ACL = 2;
const DOWNLOAD_URL_NAME = 'getDownloadUrl';

module.exports = {
  getRouterUrl(router) {
    let routerUrl = getMetaInfo('routerAddresses');
    if (!routerUrl) {
      routerUrl = router;
    }
    return routerUrl.indexOf('http') < 0 ? 'http://' + routerUrl : routerUrl;
  },

  getProxyUrl() {
    const proxyUrl = getMetaInfo('proxyAddresses');
    return proxyUrl ? (proxyUrl.indexOf('http') < 0 ? 'http://' + proxyUrl : proxyUrl) : proxyUrl;
  },

  getQiniuConfig() {
    return {
      BLOBSTORE_SERVICE_NAME,
      BLOBSTORE_SERVICE_VERSION,
      UPLOADFILE_NAME,
      UPLOADFILE_VERSION,
      UPLOADFILE_ACCESS_TYPE,
      UPLOADFILE_ACL,
      DOWNLOAD_URL_NAME,
    };
  },
};
