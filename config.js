const process = require('process');

module.exports = {
  // server listening config
  port: process.env.PORT || 3000,

  // MEGA user config
  megaAuth: {
    email: process.env['MEGA_EMAIL'],
    password: process.env['MEGA_PASSWORD']
  },

  // Referer check config
  referer: process.env['REFERER'] || 'arca.live',

  // Administrator token
  // set to anonymous object if no admintoken specified(for security reason)
  adminToken = process.env['ADMIN_TOKEN'] || {}
};