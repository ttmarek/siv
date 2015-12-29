const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;
const request = require('request');

const userDir = path.join(__dirname, 'user');
let ykinfo, ykchalresp;

if (process.platform === 'win32') {
  ykinfo = path.resolve(__dirname, '../ykpers/bin/ykinfo.exe');
  ykchalresp = path.resolve(__dirname, '../ykpers/bin/ykchalresp.exe');
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

function requestUserObj(credentials) {
  return new Promise((resolve, reject) => {
    const options = {
      url: `https://siv-server.herokuapp.com/user/${credentials.id}`,
      headers: {
        authorization: credentials.hashedId,
      },
    };
    request(options, (err, resp, body) => {
      if (!err && resp.statusCode == 200) {
        const user = JSON.parse(body);
        resolve(user);
      } else {
        reject(err);
      }
    });
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
      resolve({id: serialNum, hashedId: resp});
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
