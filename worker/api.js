const express = require('express');
const ms = require('../libs/mega-storage');
const validator = require('../libs/validator');

const router = express.Router();

router.get('/heartbeat', function(req, res) {
  res.send('OK');
});

router.post('/link', function(req, res) {
  const range = validator.validateRange(req.body.range);
  ms.getFile(req.body.string, range, function(err, urls) {
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
  ms.relinkFile(function(err, urls) {
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