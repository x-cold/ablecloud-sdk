let axios = require('axios')
let ACSign = require('./ACSign.js')

function baseUrl(router, serviceName, serviceVersion, method) {
    return router + '/' + serviceName + '/v' + serviceVersion + '/' + method
}
function buildHeaders(method, isAnoymous, config) {
    let headers = {
        'Content-Type': 'application/x-zc-object',
        'X-Zc-Major-Domain': config.majorDomain,
        'X-Zc-Access-Key': config.ak,
    }
    if (config.subDomain) {
        headers['X-Zc-Sub-Domain'] = config.subDomain;
    }
    if (isAnoymous) {
        headers['X-Zc-Access-Mode'] = '1'
        return Promise.resolve(headers)
    } else {
        return ACSign.signToken(config.developerId, config.majorDomain, config.subDomain, config.sk, method).then(signed => {
            headers['X-Zc-Nonce'] = signed.nonce
            headers['X-Zc-Timeout'] = signed.timeout.toString()
            headers['X-Zc-Timestamp'] = signed.timestamp.toString()
            headers['X-Zc-Developer-Id'] = signed.developerId.toString()
            headers['X-Zc-Developer-Signature'] = signed.signature
            return Promise.resolve(headers)
        })
    }
}
module.exports = {
    /*
     *  发起请求 
     */
    request (serviceName, serviceVersion, method, body, isAnonymous, config) {
        let url = baseUrl(config.getRouterUrl(), serviceName, serviceVersion, method)
        let ACClient = this

        return buildHeaders(method, isAnonymous, config)
            .then(headers => axios.post(url, body, {
                headers: headers
            })).then(response => {
                if (response.headers['x-zc-msg-name'] === 'X-Zc-Ack') {
                    return Promise.resolve(response.data)
                }
                return Promise.reject(response.data)
            })
    }
}
