'use strict';

const axios = require('axios');
const ACConfig = require('./config');
const sign = require('./sign');

function baseUrl(router, serviceName, serviceVersion, method) {
  return router + '/' + serviceName + '/v' + serviceVersion + '/' + method;
}

function buildHeaders(method, isAnoymous, config) {
  const headers = {
    'Content-Type': 'application/x-zc-object',
    'X-Zc-Major-Domain': config.majorDomain,
    'X-Zc-Access-Key': config.ak,
  };
  if (config.subDomain) {
    headers['X-Zc-Sub-Domain'] = config.subDomain;
  }
  if (isAnoymous) {
    headers['X-Zc-Access-Mode'] = '1';
    return headers;
  }
  const signed = sign(config.developerId, config.majorDomain, config.subDomain, config.sk, method);
  headers['X-Zc-Nonce'] = signed.nonce;
  headers['X-Zc-Timeout'] = signed.timeout.toString();
  headers['X-Zc-Timestamp'] = signed.timestamp.toString();
  headers['X-Zc-Developer-Id'] = signed.developerId.toString();
  headers['X-Zc-Developer-Signature'] = signed.signature;
  return headers;
}

class ACClient {
  constructor(config) {
    this.config = config;
  }

  /**
   * 发送请求
   *
   * @param {String} serviceName 服务名称
   * @param {String} serviceVersion 服务版本号
   * @param {String} method 方法名称
   * @param {Object} body 如: { key1: value2, key2: value2 }
   * @param {Boolean} isAnonymous 是否匿名
   *
   * @return {Function} promise
   */
  request(serviceName, serviceVersion, method, body, isAnonymous = false) {
    const { config } = this;
    const url = baseUrl(ACConfig.getRouterUrl(config.router), serviceName, serviceVersion, method);
    const headers = buildHeaders(method, isAnonymous, config);
    return axios.post(url, body, {
      headers,
    }).then(response => {
      if (response.headers['x-zc-msg-name'] === 'X-Zc-Ack') {
        return Promise.resolve(response.data);
      }
      return Promise.reject(response.data);
    });
  }
}

module.exports = ACClient;
