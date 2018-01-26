const fs = require("fs");

function readFile(filename, encoding) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, encoding, (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    });
  });
}

function writeFile(fileName, content, encoding = "utf8") {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, content, encoding, (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    });
  });
}

module.exports = {
  readFile,
  writeFile
};
