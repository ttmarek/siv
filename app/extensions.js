'use strict';
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const extDir = path.resolve(__dirname, '../extensions');

function downloadAll(userObj) {
  if (userObj.id === 'developer') {
    const downloadedExts = [{
      id: 'GyMG',
      name: 'caliper',
      path: path.join(extDir, 'caliper.js'),
    }, {
      id: 'G9Wd',
      name: 'sccir',
      path: path.join(extDir, 'sccir.js'),
    }];
    return Promise.resolve(downloadedExts);
  }

  AWS.config.update({
    region: userObj.s3.region,
    accessKeyId: userObj.s3.accessKeyId,
    secretAccessKey: userObj.s3.accessKey,
  });

  const s3 = new AWS.S3();
  return new Promise((resolve, reject) => {
    const extPromises = [];
    userObj.extensions.forEach(ext => {
      extPromises.push(downloadExt(s3, userObj.s3, ext.extId, ext.name));
    });

    Promise
      .all(extPromises)
      .then(resolve)
      .catch(reject);
  });
}

function downloadExt(s3, bucketInfo, extID, extName) {
  const extFileName = `${extID}.js`;
  const extFilePath = path.join(extDir, extFileName);
  const stream = fs.createWriteStream(extFilePath);
  return new Promise((resolve, reject) => {
    s3.getObject({
      Bucket: bucketInfo.extBucket,
      Key: extFileName,
    })
      .on('httpData', chunk => {
        stream.write(chunk);
      })
      .on('httpDone', () => {
        stream.end();
        resolve({id: extID, path: extFilePath, name: extName});
      })
      .on('httpError', (error, resp) => {
        reject(error);
      })
      .send();
  });
}

module.exports = {
  download: downloadAll,
};
