const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;
const request = require('request');

const userDir = path.join(__dirname, 'user');
let ykinfo, ykchalresp;

if (process.platform === 'win32') {
  ykinfo = 'C:/Users/marek/Desktop/ykpers-1.17.2-win64/bin/ykinfo.exe';
  ykchalresp = 'C:/Users/marek/Desktop/ykpers-1.17.2-win64/bin/ykchalresp.exe';
} else {
  ykinfo = 'ykinfo';
  ykchalresp = 'ykchalresp';
}

function getUserObject() {
  return new Promise((resolve, reject) => {
    getSerialInfo()
      .then(sendChallenge)
      .then(requestUserObj)
      .then(resolve)
      .catch(reject);
  });
}

// If something is wrong with the authentication
// try and send a 'guest' user object before sending
// an error message
// GET http://siv.integritytools.com/api/v0/user/guest
function requestUserObj(credentials) {
  return new Promise((resolve, reject) => {
    if (credentials.id === 'guest') {
      resolve({
        id: credentials.id,
        s3: {
          bucket: 'imginspector.extensions',
          accessKeyId: 'AKIAIBSUWOLBN25TT2GA',
          secretAccessKey: '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',
          region: 'us-west-2',
        },
        extensions: [{name: 'transform', id: 'qlJ6'},
                     {name: 'layers', id: 'Gza6'}]
      });
    } else {
      resolve({
        id: credentials.id,
        s3: {
          bucket: 'imginspector.extensions',
          accessKeyId: 'AKIAIBSUWOLBN25TT2GA',
          secretAccessKey: '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',
          region: 'us-west-2',
        },
        extensions: [{name: 'transform', id: 'qlJ6'},
                     {name: 'layers', id: 'Gza6'},
                     {name: 'ruler', id: 'GyMG'}]
      });
    }
  });
}

// Note: The messages recieved after calling ykinfo and ykchalresp
// comes in Uint8Arrays. Each element in the Uint8Arrays is an ASCII
// character code, so I used the String.fromCharCode function to
// convert the array of ASCII codes into a string.

function getSerialInfo() {
  return new Promise((resolve, reject) => {
    const getSerialInfo = spawn(ykinfo, ['-s']);
    getSerialInfo.stdout.on('data', output => {
      const serialInfo = String.fromCharCode(...output);
      const serialNum = /\d+/.exec(serialInfo)[0];
      resolve(serialNum);
    });
    
    getSerialInfo.stderr.on('data', output => {
      resolve('guest');
    });
  });
}

function sendChallenge(serialNum) {
  if (serialNum === 'guest') {
    return Promise.resolve({id: 'guest'});
  }
  return new Promise((resolve, reject) => {
    const getResp = spawn(ykchalresp, ['-2', serialNum]);
    getResp.stdout.on('data', output => {
      output = output.subarray(0, output.length - 1); // last char in output is \n
      const resp = String.fromCharCode(...output);
      resolve({id: serialNum, hashedID: resp});
    });

    getResp.stderr.on('data', output => {
      const msg = String.fromCharCode(...output);
      reject(`ykchalresp error:\n${msg}`);
    });
  });
}

module.exports = {
  getUserObject,
  getSerialInfo,
};
