"use strict";

const Service = require('egg').Service;
const moment = require('moment');


class StepService extends Service {
  async decrypt({ encryptedData, iv }) {
    const { ctx } = this;
    const sessionKey = await ctx.helper.getSessionKey();
    const decryptedData = ctx.helper.decryptUserInfo({
      encryptedData,
      iv,
      sessionKey
    });
    return decryptedData;
  };

  async update({ stepInfoList }) {
    const { ctx } = this;
    const { openid } = ctx.user; 
    let res = [];
    stepInfoList.forEach(({ timestamp, step }) => {
      const dateObj = new moment(timestamp * 1000);
      const date = dateObj.format('YYYY-MM-DD');
      res.push({ openid, date, step });
    });
    // console.log(res);
    res.forEach(({ openid, date, step } ) => {
      ctx.app.db.run(`
        REPLACE INTO step (openid, date, step)
        VALUES (?, ?, ?);
      `, [openid, date, step]);
    })
    return res;
  }

  async get({ date, team_id }) {
    const { ctx } = this;
    let stepData = await ctx.app.db.all(`
      SELECT 
        s.date as date,
        s.openid as openid,
        s.step as step,
        u.alias as alias,
        u.avatar_url as avatarUrl
      FROM step s, user u, team_member m
      WHERE s.openid = u.openid 
        AND m.openid = u.openid 
        AND m.status >= 1 
        AND m.team_id = ? AND s.date = ?
      ORDER BY s.date DESC, s.step DESC;
    `, [team_id, date]);
    // console.log(stepData)
    return stepData;
  }
};

module.exports = StepService;