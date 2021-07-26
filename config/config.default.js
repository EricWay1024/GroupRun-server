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

  const isInnerIp = ip => (ip === "127.0.0.1" || ip === "192.168.40.123" || true);
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
      appid: "wx56b313738beeb647",
      secret: "e6995785b688fbf5b968821026f990b4"
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


// create table login (openid text primary key not null, session_key text not null);
// create table step (openid text not null, date date not null, step int not null, primary key (openid, date));
// create table user (openid text primary key not null, nickname text not null, alias text, avatar_url text not null);
// create table team (team_id INTEGER PRIMARY KEY, name text not null);
// create table team_member (team_id INTEGER not null, openid text not null, status integer not null, primary key (team_id, openid));
// status: 0: deleted, -1: pending application, 1: member, 2: admin

// insert into user (openid, nickname, alias, avatar_url) values ('dog', 'Dog', 'Dog', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI2wpwDvdHeibgdI9ybwKrz3JdvNgHnshezknOXcQxRG76ibtygwr8khdfFLibXyFRiaQ3OCjic1rtKyRg/132');
// replace into team_member (team_id, openid, status) values (6, 'dog', -1);