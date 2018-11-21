'use strict';

const AbleCloud = require('.');

const ac = new AbleCloud({
  developerId: 'developerId',
  majorDomain: 'majorDomain',
  subDomain: 'subDomain',
  ak: 'ak',
  sk: 'sk',
  router: 'router',
});

ac.getDownloadUrl('test', '1.png')
  .then(resp => console.log(resp))
  .catch(error => console.log(error));

const array = new Uint8Array(4);
array.set([ 31, 31, 31 ]);
ac.uploadFile(array, 'test', '1.png')
  .then(resp => {
    console.log(resp);
  })
  .catch(error => console.log(error));
