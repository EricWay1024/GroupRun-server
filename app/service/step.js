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
    const { openid } = ctx.user;
    let stepData = await ctx.app.db.all(`
    WITH A AS (
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
    ),
    B AS (
      SELECT 
        s.date, s.openid, 
        SUM(l.state) as likeCnt, 
        SUM(CASE WHEN l.givr_openid = ? THEN l.state ELSE 0 END) as myLike
      FROM step_like l, step s
      WHERE l.date = s.date AND l.recv_openid = s.openid
      GROUP BY s.date, s.openid
    )
    SELECT 
      A.date,
      A.openid,
      A.step,
      A.alias,
      A.avatarUrl,
      B.likeCnt,
      B.myLike
    FROM A
    LEFT JOIN B ON A.date = B.date AND A.openid = B.openid
    ORDER BY A.step DESC;
    `, [team_id, date, openid]);
    // console.log(stepData);
    return stepData;
  }

  async like({ date, recv_openid, state }) {
    const { ctx } = this;
    const { openid } = ctx.user;
    await ctx.app.db.run(`
      REPLACE INTO step_like (givr_openid, recv_openid, date, state)
      VALUES (?, ?, ?, ?);
    `, [openid, recv_openid, date, state]);
    return state;
  }
};

module.exports = StepService;