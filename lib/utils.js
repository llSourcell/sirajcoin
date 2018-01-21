const fs = require("fs");

function readFile(filename, encoding) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, encoding, (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    });
  });
}

module.exports = {
  readFile
};
