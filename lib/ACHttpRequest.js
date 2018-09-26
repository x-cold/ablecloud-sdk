let axios = require('axios')
let ACSign = require('./ACSign.js')

/*
 * 注意： axios对proxy的支出不够完善，此处用的axios为修改后的版本 见：https://github.com/axios/axios/pull/959
 */
module.exports = function (options, config) {
    let authName = config.developerId + "#" + config.majorDomain + "#";
    return ACSign.signToken(config.developerId, config.majorDomain, config.sk, "proxy").then(signed => {
        let authPassword = signed.timestamp + "#" + config.ak + "#" + signed.signature;
        let proxyUrl = config.getProxyUrl();
        if (proxyUrl) {
            options.proxy = {
                host: proxyUrl.replace(/http.*\/\//g, '').replace(/\:.*/g, ''),
                port: proxyUrl.replace(/.+\/\/.+\:/g, ''),
                auth: {
                  username: authName,
                  password: authPassword
                }
            }
        }
        return axios(options);
    });
}
