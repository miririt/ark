const mega = require('megajs');

mega.File.prototype.clink = function(options, cb) {

  // valid link count
  if(this.linkCount && this.linkCount > 20) {
    this.invalidLink = true;
  } else {
    this.linkCount = this.linkCount ? (this.linkCount + 1) : 1;
  }

  if (arguments.length === 1 && typeof options === 'function') {
    cb = options;
    options = {
      noKey: false
    };
  }
  if (typeof options === 'boolean') {
    options = {
      noKey: options
    };
  }

  if(this.linkCache) {
    return cb(null, this.linkCache);
  } else {
    this.link(options, (err, url) => {
      if(err) return cb(err);
      this.linkCache = url;
      cb(null, url);
    });
  }
}

mega.File.prototype.unlink = function(cb) {
  this.api.request({
    a: 'l',
    d: 1,
    n: this.nodeId
  }, (err) => {
    if (err) return cb(err);
    delete this.link;
    this.linkCount = 0;
    this.invalidLink = false;
    cb(null);
  });
  return this;
}

mega.File.prototype.relink = function(options, cb) {
  if (arguments.length === 1 && typeof options === 'function') {
    cb = options;
    options = {
      noKey: false
    };
  }
  if (typeof options === 'boolean') {
    options = {
      noKey: options
    };
  }

  this.unlink((err) => {
    if(err) return cb(err);
    this.clink(options, cb);
  });
  return this;
}

module.exports = mega;