'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  sqlite3: {
    enable: true,
    package: 'egg-sqlite3',
  }
};
