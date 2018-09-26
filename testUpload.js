let ac = require('./index.js')

ac.init('developerId', 'majorDomain', '', 'ak', 'sk', 'router');

ac.getDownloadUrl('test', '1.png')
	.then(resp => console.log(resp))
    .catch(error => console.log(error));

let array = new Uint8Array(4)
array.set([31, 31, 31])
ac.uploadFile(array, 'test', '1.png')
	.then(resp => {
		console.log(resp)
	})
    .catch(error => console.log(error));
