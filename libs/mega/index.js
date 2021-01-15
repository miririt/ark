const mega = require('megajs');

function e64(buffer) {
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// for array-request api
mega.Storage = class NewStorage extends mega.Storage {
  constructor(...args) {
    super(...args);

    // imeplents array request
    this.api._request = function(arrJson, cb, retryno = 0) {
      const qs = {
        id: (this.counterId++).toString()
      };
  
      if (this.sid) {
        qs.sid = this.sid;
      }
  
      if (typeof arrJson._querystring === 'object') {
        Object.assign(qs, arrJson._querystring);
        delete arrJson._querystring;
      }
  
      this.requestModule({
        uri: `${this.gateway}cs`,
        qs,
        method: 'POST',
        json: arrJson,
        gzip: true
      }, (err, req, resp) => {
        if (err) return cb(err);
        if (!resp) return cb(Error('Empty response')); // Some error codes are returned as num, some as array with number.
  
        if (!err && typeof resp === 'number' && resp < 0) {
          if (resp === -3) {
            if (retryno < MAX_RETRIES) {
              return setTimeout(() => {
                this.request(json, cb, retryno + 1);
              }, Math.pow(2, retryno + 1) * 1e3);
            }
          }
  
          err = Error(ERRORS[-resp]);
        } else {
          if (this.keepalive && resp && resp.sn) {
            this.pull(resp.sn);
          }
        }
  
        cb(err, resp);
      });
    };
  }
};

mega.clinks = function(files, cb) {

  const cachedLinks = [];
  const targetFiles = files.filter(file => {
    // valid link count
    if(file.linkCount && file.linkCount > 20) {
      file.invalidLink = true;
    } else {
      file.linkCount = file.linkCount ? (file.linkCount + 1) : 1;
    }

    if(file.cachedLink) {
      cachedLinks.push({
        name: file.name,
        link: file.cachedLink
      });
      return false;
    } else {
      return true;
    }
  });

  const requestJson = targetFiles.map(file => {
    return {
      a: 'l',
      n: file.nodeId
    };
  });

  if(targetFiles.length > 0) {
    // Get storage api from file. Target is no need to be first element.
    const firstApi = targetFiles[0].api;
    
    firstApi._request(requestJson, (err, res) => {
      if (err) return cb(err);

      const links = res.map((id, idx) => {
        let url$$1 = `https://mega.nz/file/${id}`;
        if (targetFiles[idx].key) url$$1 += `#${e64(targetFiles[idx].key)}`;
        return {
          name: targetFiles[idx].name,
          link: (targetFiles[idx].cachedLink = url$$1)
        };
      });
      
      cb(null, links.concat(cachedLinks));
    });
  } else {
    cb(null, cachedLinks);
  }

  return this;
}

mega.unlinks = function(files, cb) {
  const requestJson = files.map(file => {
    return {
      a: 'l',
      d: 1,
      n: file.nodeId
    };
  });

  // Get storage api from file. Target is no need to be first element.
  const firstApi = files[0].api;

  firstApi._request(requestJson, (err, res) => {
    if (err) return cb(err);

    files.forEach(file => {
      delete file.cachedLink;
      file.linkCount = 0;
      file.invalidLink = false;
    });
    
    cb(null);
  });
  
  return this;
}

mega.relinks = function(files, cb) {

  this.unlinks(files, (err) => {
    if(err) return cb(err);
    this.clinks(files, cb);
  });

  return this;
}

function exportMega(...args) {
  return new mega.Storage(...args);
}

for(const key in mega) {
  exportMega[key] = mega[key];
}

module.exports = exportMega;