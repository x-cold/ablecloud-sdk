var ac = require('./dist/ac-node-sdk.js')

/*
 * 初始化ac
 *
 * @param developerId       开发者id
 * @param majorDomain       主域
 * @param subDomain         子域，可为空值
 * @param ak                开发者秘钥
 * @param sk                开发者秘钥
 * @param router            请求地址如: test.ablecloud.cn:5000
 *
 */
ac.init('developerId', 'majorDomain', 'ak', 'sk', 'router');
/*
 * 发送请求(开发者签名)
 *
 * @param serviceName       服务名称
 * @param serviceVersion    服务版本号
 * @param method            方法名称
 * @param body              Object 类型如: { key1: value2, key2: value2 }
 *
 */
ac.sendToService('serviceName', 1, 'method', { key1: value2, key2: value2 })
    .then(resp => console.log(resp))
    .catch(error => console.log(error));

/*
 * 发送匿名请求
 *
 * @param serviceName       服务名称
 * @param serviceVersion    服务版本号
 * @param method            方法名称
 * @param body              Object 类型如: { key1: value2, key2: value2 }
 *
 */ 
ac.sendToServiceWithoutSign('serviceName', 1, 'method', { key1: value2, key2: value2 })
    .then(resp => console.log(resp))
    .catch(error => console.log(error));    

/*
 * 发送外网请求
 *
 * @param options           见axios的请求options：  https://www.npmjs.com/package/axios#request-config
 *
 * 调用方法如：ac.createHttpRequest({
 *                  method: 'post',
 *                  url: 'https://XXX.COM',
 *                  data: { key1: value2, key2: value2 }
 *              }).then(resp => {}).catch(err => {})
 */
ac.createHttpRequest({
    method: 'get',
    url: 'https://www.baidu.com/'
}).then(resp => console.log(resp.data))
.catch(error => console.log(error));
