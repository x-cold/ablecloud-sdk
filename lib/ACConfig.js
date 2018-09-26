let fs = require('fs')

function getMetaInfo(key) {
    let result;
    if (process.env.META_FILE_PATH) {
        let metaFilePath = process.env.META_FILE_PATH + "/ac-metaInfo";
        if (fs.existsSync(metaFilePath)) {
            let data = fs.readFileSync(metaFilePath)
            try {
                let metaInfo = JSON.parse(data);
                if (metaInfo[key]) {
                    let urls = metaInfo[key].split(',');
                    if (urls.length > 0) {
                        result = urls[Math.floor(Math.random() * urls.length)];
                    }
                }
            } catch (ex) {}
        }
    }
    return result;
}

module.exports =  {
    developerId: null,
    majorDomain: null,
    subDomain: null,
    router: null,
    ak: null,
    sk: null,
    getRouterUrl() {
        let routerUrl = getMetaInfo('routerAddresses');
        if (!routerUrl) {
            routerUrl = this.router;
        }
        return routerUrl.indexOf('http') < 0 ? 'http://' + routerUrl : routerUrl;
    },
    getProxyUrl() {
        let proxyUrl = getMetaInfo('proxyAddresses');
        return proxyUrl ? (proxyUrl.indexOf('http') < 0 ? 'http://' + proxyUrl : proxyUrl) : proxyUrl;
    }
}
