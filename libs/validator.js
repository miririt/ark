const config = require('../config');

function Validator() { }

Validator.isAdmin = function(adminToken) {
  return adminToken === config.adminToken;
}
module.exports = Validator;