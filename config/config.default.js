/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1626787568639_7090';

  // add your middleware config here
  config.middleware = [];

  const isInnerIp = ip => (ip === "127.0.0.1" || true);
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    security: {
      csrf: {
        // 判断是否需要 ignore 的方法，请求上下文 context 作为第一个参数
        ignore: ctx => isInnerIp(ctx.ip),
      }
    },
    sqlite3: {
      database: 'dev.db'
    },
    weapp: {
      appid: "wx8c6e1ee4c3a81369",
      secret: "52407ec6e4ce5ab916ff9e226a5d28c9"
    },
    jwt: {
      secret: "adfadnvzx02<DISx,sssdu239"
    }
  };

  return {
    ...config,
    ...userConfig,
  };
};
