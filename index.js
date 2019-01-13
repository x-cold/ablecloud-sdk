'use strict';

const qiniu = require('qiniu');
const ACConfig = require('./lib/config');
const ACClient = require('./lib/client');
const proxyRequest = require('./lib/proxy');

const qiniuConfig = ACConfig.getQiniuConfig();
const {
  BLOBSTORE_SERVICE_NAME,
  BLOBSTORE_SERVICE_VERSION,
  UPLOADFILE_NAME,
  UPLOADFILE_VERSION,
  UPLOADFILE_ACCESS_TYPE,
  // UPLOADFILE_ACL,
  DOWNLOAD_URL_NAME,
} = qiniuConfig;

class AbleCloud {
  constructor({ developerId, majorDomain, subDomain, ak, sk, router }) {
    const config = {};
    config.developerId = developerId;
    config.majorDomain = majorDomain;
    config.subDomain = subDomain;
    config.ak = ak;
    config.sk = sk;
    config.router = router;
    this.config = config;
    this.client = new ACClient(config);
  }

  /**
   * 发送请求(开发者签名)
   *
   * @param {String} serviceName 服务名称
   * @param {String} serviceVersion 服务版本号
   * @param {String} method 方法名称
   * @param {Object} body 如: { key1: value2, key2: value2 }
   *
   * @return {Function} promise
   */
  sendToService(serviceName, serviceVersion, method, body) {
    const { client } = this;
    return client.request(serviceName, serviceVersion, method, body);
  }

  /**
   * 发送匿名请求
   *
   * @param {String} serviceName 服务名称
   * @param {String} serviceVersion 服务版本号
   * @param {String} method 方法名称
   * @param {Object} body 如: { key1: value2, key2: value2 }
   *
   * @return {Function} promise
   */
  sendToServiceWithoutSign(serviceName, serviceVersion, method, body) {
    const { client } = this;
    return client.request(serviceName, serviceVersion, method, body, true);
  }

  /**
   * 上传文件到服务存储
   *
   * @param {String} bytes 文件内容
   * @param {String} bucket 文件集名称。
   * @param {String} name 要访问/下载的文件在云端的名字。
   *
   * @return {Function} promise
   */
  uploadFile(bytes, bucket, name) {
    const request = {
      bucket, name, version: UPLOADFILE_VERSION, accessType: UPLOADFILE_ACCESS_TYPE, acl: {
        isPublicReadAllow: true,
        isPublicWriteAllow: true,
      },
    };
    const { config, client } = this;
    return client.request(BLOBSTORE_SERVICE_NAME, BLOBSTORE_SERVICE_VERSION, UPLOADFILE_NAME, request, false, config)
      .then(resp => {
        // const storeType = resp.storeType;
        const upToken = resp.uptoken;
        const key = resp.bucket + '/' + resp.name;

        const config = new qiniu.conf.Config();
        const formUploader = new qiniu.form_up.FormUploader(config);
        const putExtra = new qiniu.form_up.PutExtra();

        return new Promise((resolve, reject) => {
          formUploader.put(upToken, key, bytes, putExtra, (respErr,
            respBody, respInfo) => {
            if (respErr) {
              throw respErr;
            }
            if (respInfo.statusCode === 200) {
              return this.getDownloadUrl(bucket, name)
                .then(resp => {
                  return resolve(resp);
                }).catch(error => {
                  return reject(error);
                });
            }
            reject(respBody);
          });
        });
      }).catch(error => {
        return Promise.reject(error);
      });
  }

  /**
   * 获取上传文件的URL
   *
   * @param {String} bucket 文件集名称。
   * @param {String} name 要访问/下载的文件在云端的名字
   *
   * @return {Function} promise
   */
  getDownloadUrl(bucket, name) {
    const { config, client } = this;
    return client.request(BLOBSTORE_SERVICE_NAME, BLOBSTORE_SERVICE_VERSION, DOWNLOAD_URL_NAME, { bucket, name }, false, config)
      .then(resp => {
        return Promise.resolve(resp.downloadUrl);
      }).catch(error => {
        return Promise.reject(error);
      });
  }

  /**
   * 发送代理外网请求
   *
   * @param {Object} options 见 axios 的请求 options：  https://www.npmjs.com/package/axios#request-config
   *
   * 调用方法如：
   * ac.createHttpRequest({
   *   method: 'post',
   *   url: 'https://XXX.COM',
   *   data: { key1: value2, key2: value2 }
   * }).then(resp => {}).catch(err => {})
   *
   * @return {Function} promise
   */
  createHttpRequest(options) {
    const { config } = this;
    return proxyRequest(options, config);
  }
}

module.exports = AbleCloud;
