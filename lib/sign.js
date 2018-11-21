'use strict';

const crypto = require('crypto');

function signToken(developerId, majorDomain, subDomain, sk, method) {
  const base = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const signed = {
    sk,
    method,
    timeout: (5 * 60),
    developerId,
    majorDomain,
    subDomain: subDomain || '',
    timestamp: Math.floor(Date.now() / 1000),
    nonce: Array.apply(null, Array(16)).map(() => base[Math.floor(Math.random() * base.length)]).join('')
  };

  signed.signature = crypto.createHmac('sha256', sk).update(
    signed.timeout.toString()
    + signed.timestamp.toString()
    + signed.nonce
    + signed.developerId.toString()
    + signed.method
    + signed.majorDomain
    + signed.subDomain,
    sk
  ).digest('hex');

  return signed;
}

module.exports = signToken;
