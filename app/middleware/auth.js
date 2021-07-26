"use strict";
const jwt = require('jwt-simple');

module.exports = (options) => {
  return async function auth(ctx, next) {
    if (ctx.request.headers.authorization) {
      const openid = jwt.decode(ctx.request.headers.authorization, ctx.app.config.jwt.secret);
      ctx.user = { ...(ctx.user ? ctx.user : {}), openid };
      await next();
    } else {
      ctx.body = { 
        code: 401,
        msg: "You have not logged in."
      }
    }
  }
}