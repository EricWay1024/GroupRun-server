"use strict";
const crypto = require("crypto");
module.exports = {
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  async memberStatus({ team_id }) {
    const { ctx } = this;
    const { openid } = ctx.user;

    const res = await ctx.app.db.all(`
      SELECT status FROM team_member
      WHERE openid=? AND team_id=?;
    `, [openid, team_id]);

    if (!res) return 0;
    else return res[0].status;
  },

  async getSessionKey() {
    const { ctx } = this;
    const { openid } = ctx.user;
    const sessionKey = await ctx.app.db.all(`
      SELECT * FROM login
      WHERE openid=?
    `, [openid]).then(r => r[0].session_key); // get should work here but somehow doesn't
    return sessionKey;
  },
  decryptUserInfo({ encryptedData, iv, sessionKey }) {
    sessionKey = Buffer.from(sessionKey, "base64");
    encryptedData = Buffer.from(encryptedData, "base64");
    iv = Buffer.from(iv, "base64");
    let decoded;
    try {
      const decipher = crypto.createDecipheriv("aes-128-cbc", sessionKey, iv);
      decipher.setAutoPadding(true);
      decoded = decipher.update(encryptedData, "binary", "utf8");
      decoded += decipher.final("utf8");
      decoded = JSON.parse(decoded);
    } catch (err) {
      throw new Error("Illegal Buffer");
    }
    const { appid } = this.ctx.app.config.weapp;
    if (decoded.watermark.appid !== appid) {
      throw new Error("Illegal Buffer");
    }
    return decoded;
  }
}