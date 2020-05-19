'use strict';

function parseTime(time) {
  return ('0000' + time.getFullYear()).slice(-4) + '-' + ('00' + (time.getMonth() + 1)).slice(-2) + '-' + ('00' + time.getDate()).slice(-2) + ' ' + ('00' + time.getHours()).slice(-2) + ':' + ('00' + time.getMinutes()).slice(-2) + ':00';
}

module.exports = parseTime;