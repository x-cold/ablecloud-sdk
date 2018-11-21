'use strict';

const axios = require('axios');
const ACConfig = require('./config');
const sign = require('./sign');

/*
 * 注意：axios 对 proxy 的支持不够完善，此处用的 axios 为修改后的版本 见：https://github.com/axios/axios/pull/959
 */
module.exports = function proxyRequest(options, config) {
  const authName = config.developerId + '#' + config.majorDomain + '#';
  const signed = sign(config.developerId, config.majorDomain, config.sk, 'proxy');
  const authPassword = signed.timestamp + '#' + config.ak + '#' + signed.signature;
  const proxyUrl = ACConfig.getProxyUrl();
  if (proxyUrl) {
    options.proxy = {
      host: proxyUrl.replace(/http.*\/\//g, '').replace(/\:.*/g, ''),
      port: proxyUrl.replace(/.+\/\/.+\:/g, ''),
      auth: {
        username: authName,
        password: authPassword,
      },
    };
  }
  return axios(options);
};
