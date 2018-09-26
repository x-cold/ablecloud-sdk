let ACClient = require('./lib/ACClient.js')
let ACConfig = require('./lib/ACConfig.js')
let ACHttpRequest = require('./lib/ACHttpRequest.js')
var qiniu = require("qiniu");

var BLOBSTORE_SERVICE_NAME = "zc-blobstore"
var BLOBSTORE_SERVICE_VERSION = 1
var UPLOADFILE_NAME = "uploadFileInfo"
var UPLOADFILE_VERSION = 2
var UPLOADFILE_ACCESS_TYPE = "public"
var UPLOADFILE_ACL = 2
var DOWNLOAD_URL_NAME = "getDownloadUrl"
module.exports = {
    /*
     * 初始化ac
     *
     * @param developerId       开发者id
     * @param majorDomain       主域
     * @param subDomain         子域
     * @param ak                开发者秘钥
     * @param sk                开发者秘钥
     * @param router            请求地址如: test.ablecloud.cn:5000
     *
     */
    init(developerId, majorDomain, subDomain, ak, sk, router) {
        ACConfig.developerId = developerId
        ACConfig.majorDomain = majorDomain
        ACConfig.subDomain = subDomain
        ACConfig.router = router
        ACConfig.ak = ak
        ACConfig.sk = sk
    },
    /*
     * 发送请求(开发者签名)
     *
     * @param serviceName       服务名称
     * @param serviceVersion    服务版本号
     * @param method            方法名称
     * @param body              Object 类型如: { key1: value2, key2: value2 }
     *
     */
    sendToService(serviceName, serviceVersion, method, body) {
        return ACClient.request(serviceName, serviceVersion, method, body, false, ACConfig)
    },
    /*
     * 发送匿名请求
     *
     * @param serviceName       服务名称
     * @param serviceVersion    服务版本号
     * @param method            方法名称
     * @param body              Object 类型如: { key1: value2, key2: value2 }
     *
     */
    sendToServiceWithoutSign(serviceName, serviceVersion, method, body) {
        return ACClient.request(serviceName, serviceVersion, method, body, true, ACConfig)
    },
    /*
     * 上传文件到服务存储
     *
     * @param bytes        文件内容
     * @param bucket       文件集名称。
     * @param name         要访问/下载的文件在云端的名字。
     *
     */
    uploadFile(bytes, bucket, name){
        var request = {bucket, name, version:UPLOADFILE_VERSION, accessType:UPLOADFILE_ACCESS_TYPE, acl:{
            isPublicReadAllow:true, isPublicWriteAllow:true
        }};
        return ACClient.request(BLOBSTORE_SERVICE_NAME, BLOBSTORE_SERVICE_VERSION, UPLOADFILE_NAME, request, false, ACConfig)
            .then(resp => {
                var storeType = resp.storeType
                var upToken = resp.uptoken
                var key = resp.bucket + '/' + resp.name

                var config = new qiniu.conf.Config();
                var formUploader = new qiniu.form_up.FormUploader(config)
                var putExtra = new qiniu.form_up.PutExtra()

                return new Promise((resolve,reject) => {
                    formUploader.put(upToken, key, bytes, putExtra, (respErr,
                    respBody, respInfo) => {
                    if (respErr) {
                        throw respErr
                    }
                    if (respInfo.statusCode == 200) {
                        return this.getDownloadUrl(bucket,name)
                        .then(resp => {
                            return resolve(resp);
                        }).catch(error => {
                            return reject(error);
                        })
                    } else {
                        console.log(respInfo.statusCode)
                        console.log(respBody);
                        reject(respBody)
                    }
                    });
                })
            }).catch(error => {
                return Promise.reject(error)
            }
        );  
    },
    /*
     * 获取上传文件的URL
     *
     * @param bucket       文件集名称。
     * @param name         要访问/下载的文件在云端的名字。
     *
     */
    getDownloadUrl(bucket, name){
        return ACClient.request(BLOBSTORE_SERVICE_NAME, BLOBSTORE_SERVICE_VERSION, DOWNLOAD_URL_NAME, {bucket, name}, false, ACConfig)
            .then(resp => {
                return Promise.resolve(resp.downloadUrl)
            }).catch(error => {
                return Promise.reject(error)
            }
        );  
    },
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
    createHttpRequest(options) {
        return ACHttpRequest(options, ACConfig);
    }
}
