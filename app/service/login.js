"use strict";

const Service = require('egg').Service;
const jwt = require('jwt-simple'); 


class LoginService extends Service {
  async index({ code }) {
    const { ctx } = this;
    const { appid, secret } = ctx.app.config.weapp;
    const res = await ctx.curl(
        // `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`,
        `https://api.weixin.qq.com/sns/jscode2session`,
        { 
          dataType: 'json',
          data: {
            appid,
            secret,
            js_code: code,
            grant_type: "authorization_code"
          }
        }
    );
    // console.log(res.data)
    const { openid, session_key } = res.data; 
    const token = jwt.encode(openid, this.ctx.app.config.jwt.secret);
    ctx.app.db.run(`
        REPLACE INTO login (openid, session_key) 
        VALUES(?, ?);
    `, [openid, session_key]);
    // console.log(`token: ${token}`);
    return token;
  };
};

module.exports = LoginService;