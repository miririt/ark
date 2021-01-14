const config = require('../config');

function Validator() { }

Validator.isAdmin = function(adminToken) {
  return adminToken === config.adminToken;
}

Validator.validateRange = function(range) {
  let rangeStart = parseInt(range.start);
  let rangeEnd = parseInt(range.end);

  if('number' !== typeof rangeStart || isNaN(rangeStart)) rangeStart = 0;
  if('number' !== typeof rangeEnd || isNaN(rangeEnd)) rangeEnd = 10;

  if(rangeStart < 0) rangeStart = 0;
  if(rangeEnd < rangeStart) rangeEnd = rangeStart + 10;
  if(rangeEnd - rangeStart > 10) rangeEnd = rangeStart + 10;

  return {
    start: rangeStart,
    end: rangeEnd
  };
}

module.exports = Validator;