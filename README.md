# ablecloud-sdk

NodeJS SDK for AbleCloud Web App

## how to use

### install package

```
npm install -S ablecloud-sdk
```

### import package

```js
const AbleCloud = require('ablecloud-sdk');
```

### init with configurations achived from AbleCloud

```js
const ac = new AbleCloud({
  developerId: 'developerId',
  majorDomain: 'majorDomain',
  subDomain: 'subDomain',
  ak: 'ak',
  sk: 'sk',
  router: 'router',
});
```

### start a request to UDS or Matrix

```js
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
```

### start a http request

```js
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
})
    .then(resp => console.log(resp.data))
    .catch(error => console.log(error));
```
