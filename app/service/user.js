"use strict";

const Service = require('egg').Service;

class UserService extends Service {
  async update({ nickname, avatarUrl, alias }) {
    const { ctx } = this;
    const { openid } = ctx.user;
    const res = await ctx.app.db.all(`
      SELECT * FROM user WHERE openid=?;
    `, [openid]);
    const oldUser = res.length ? res[0] : {};
    const newUser = {
      openid, 
      ...oldUser,
    };
    if (nickname) newUser.nickname = nickname;
    if (avatarUrl) newUser.avatar_url = avatarUrl;
    if (alias) newUser.alias = alias;

    ctx.user = newUser;
    // console.log(oldUser, newUser)
    await ctx.app.db.run(`
      REPLACE INTO user (openid, nickname, avatar_url, alias)
      VALUES (?, ?, ?, ?);
    `, [openid, newUser.nickname, newUser.avatar_url, newUser.alias]);

    return newUser;
  }

  async get() {
    const { ctx } = this;
    const { openid } = ctx.user;
    const res = await ctx.app.db.all(`
      SELECT * FROM user WHERE openid=?;
    `, [openid]);
    return res.length ? res[0] : {};
  }
};

module.exports = UserService;