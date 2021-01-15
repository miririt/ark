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

  mega.clinks(targetFiles, (err, res) => {
    if(err) cb(err);
    cb(null, res);
  });

  return this;
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

  mega.unlinks(targetFiles, (err) => {
    if(err) cb(err);
    cb(null);
  });
  
  return this;
};

MEGAStorage.prototype.relinkFile = function(cb) {
  // If files are not loaded
  if(!this.files) { return cb('404'); }

  // search target file
  // maximum relink num is 100 for each relink request
  const targetFiles = this.files.filter(file => file.invalidLink).slice(0, 100);

  mega.relinks(targetFiles, (err, res) => {
    if(err) cb(err);
    cb(null, res);
  });

  return this;
};

module.exports = new MEGAStorage();