const process = require('process');

module.exports = {};

// server listening config
module.exports.port = process.env.PORT || 3000;

// MEGA user config
module.exports.megaAuth = {
  email: process.env['MEGA_EMAIL'],
  password: process.env['MEGA_PASSWORD']
};

// Administrator token
module.exports.adminToken = process.env['ADMIN_TOKEN'];