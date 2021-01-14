const mega = require('./mega');
const config = require('../config');

function MEGAStorage() {
  console.log('MEGA Storage login');
  
  this.login = false;
  this.storage = mega(config.megaAuth, (err) => {
    if(err) throw err;
    console.log('MEGA Storage login success');
    this.login = true;
    this.listFiles();
  });

  return this;
}

MEGAStorage.prototype.listFiles = function() {
  const unsortedFiles = [];
  for(const key in this.storage.files) {
    const fileObj = this.storage.files[key];
    // File object with code(for sorting)
    if(!fileObj.directory) {
      fileObj.upperName = fileObj.name.toUpperCase();
      unsortedFiles.push(fileObj);
    }
  }
  this.files = unsortedFiles;
};

MEGAStorage.prototype.update = function(cb) {
  this.storage.reload(() => {
    this.listFiles();
    cb();
  });
};

MEGAStorage.prototype.getFile = function(name, range, cb) {
  // If files are not loaded
  if(!this.files) { return cb('404'); }
  
  const queries = name.toUpperCase().split();

  // search target file
  const targetFiles = this.files.filter(file => {
    return queries.every(queryString => {
      return file.upperName.indexOf(queryString) != -1;
    });
  }).slice(range.start, range.end);

  const fileLinkPromises = targetFiles.map(file => {
    return new Promise(function(resolve, reject){
      file.clink(function(err, url) {
        if(err) reject(err);
        else {
          resolve({ name: file.name, link: url });
        }
      });
    });
  });

  Promise.all(fileLinkPromises)
  .then(links => cb(null, links));
};

MEGAStorage.prototype.unlinkFile = function(name, cb) {
  // If files are not loaded
  if(!this.files) { return cb('404'); }
  
  const queries = name.toUpperCase().split();

  // search target file
  const targetFiles = this.files.filter(file => {
    return queries.every(queryString => {
      return file.upperName.indexOf(queryString) != -1;
    });
  });

  const fileLinkPromises = targetFiles.map(file => {
    return new Promise(function(resolve, reject){
      file.unlink(function(err) {
        if(err) reject(err);
        else resolve(file.name);
      });
    });
  });

  Promise.all(fileLinkPromises)
  .then(links => cb(null, links));
};

MEGAStorage.prototype.relinkFile = function(cb) {
  // If files are not loaded
  if(!this.files) { return cb('404'); }

  // search target file
  // maximum relink num is 100 for each relink request
  const targetFiles = this.files.filter(file => file.invalidLink).slice(0, 100);

  const fileLinkPromises = targetFiles.map(file => {
    return new Promise(function(resolve, reject){
      file.relink(function(err, url) {
        if(err) reject(err);
        else resolve({ name: file.name, link: url });
      });
    });
  });

  Promise.all(fileLinkPromises)
  .then(links => cb(null, links));
};

module.exports = new MEGAStorage();