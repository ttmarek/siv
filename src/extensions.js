const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const extDir = path.join(__dirname, 'extensions'); 

function downloadAll(userObj) {
  if (userObj.id === 'developer') {
    const downloadedExts = [{
      id: 'GyMG',
      path: '/media/Storage/Documents/projects/integritytools/siv-ruler/build/ruler.js'
    }];
    return Promise.resolve(downloadedExts);
  }
  
  AWS.config.update({
    accessKeyId: userObj.s3.accessKeyId,
    secretAccessKey: userObj.s3.secretAccessKey,
    region: userObj.s3.region,
  });
  
  const s3 = new AWS.S3();
  return new Promise((resolve, reject) => {
    const extPromises = [];
    userObj.extensions.forEach(ext => {
      extPromises.push(downloadExt(s3, userObj, ext.id));
    });
    
    Promise
      .all(extPromises)
      .then(resolve)
      .catch(reject);
  });
}

function downloadExt(s3, userObj, extID) {
  const extFileName = `${extID}.js`;
  const extFilePath = path.join(extDir, extFileName);
  const stream = fs.createWriteStream(extFilePath);
  return new Promise((resolve, reject) => {
    s3.getObject({
      Bucket: userObj.s3.bucket,
      Key: extFileName,
    })
      .on('httpData', chunk => {
        stream.write(chunk);
      })
      .on('httpDone', () => {
        stream.end();
        resolve({id: extID, path: extFilePath});
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
