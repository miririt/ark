const express = require('express');
const ms = require('./mega-storage');
const validator = require('./validator');

const router = express.Router();

router.get('/heartbeat', function(req, res) {
  res.send('OK');
});

router.post('/link', function(req, res) {
  ms.getFile(req.body.query, function(err, urls) {
    if(err) {
      res.status(404).end();
    } else {
      res.json(urls);
    }
  });
});

router.post('/relink', function(req, res) {
  if(!validator.isAdmin(req.body.adminToken)) {
    return res.status(403).end();
  }
  ms.relinkFile(req.body.query, function(err, urls) {
    if(err) {
      res.status(404).end();
    } else {
      res.json(urls);
    }
  });
});

router.delete('/link', function(req, res) {
  if(!validator.isAdmin(req.body.adminToken)) {
    return res.status(403).end();
  }
  ms.unlinkFile(req.body.query, function(err, files) {
    if(err) {
      res.status(404).end();
    } else {
      res.json(files);
    }
  });
});

router.post('/update', function(req, res) {
  if(!validator.isAdmin(req.body.adminToken)) {
    return res.status(403).end();
  }
  ms.update(() => {
    res.send('OK');
  });
});

module.exports = router;