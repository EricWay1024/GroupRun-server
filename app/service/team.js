"use strict";

const Service = require('egg').Service;
const assert = require('assert');

class TeamService extends Service {
  async create({ name }) {
    const { ctx } = this;
    const { openid } = ctx.user;
    let res
    let team_id;
    const cnt = await ctx.app.db.all(`
      SELECT count(1) as cnt FROM team;
    `).then(r => r[0].cnt);
    const upperBound = Math.max(99, cnt * 10);
    while (true) {
      team_id = ctx.helper.getRandomInt(1, upperBound);
      res = await ctx.app.db.all(`
        SELECT * FROM team
        WHERE team_id=?;
      `, [team_id]);
      if (res.length === 0) break;
      // console.log(res)
    }

    await ctx.app.db.run(`
      INSERT INTO team (team_id, name)
      VALUES (?, ?);
    `, [team_id, name]);
    // console.log(`new team id = ${team_id}`)

    await ctx.app.db.run(`
      INSERT INTO team_member(team_id, openid, status)
      VALUES (?, ?, ?);
    `, [team_id, openid, 2]);

    return team_id;
  }

  async update({ team_id, name }) {
    const { ctx } = this;
    if (await ctx.helper.memberStatus({ team_id }) !== 2) {
      // console.log('Unauthorized.')
      return;
    }
    await ctx.app.db.run(`
      REPLACE INTO team (team_id, name)
      VALUES (?, ?);
    `, [team_id, name]);
    return name;
  }

  async updateMember({ team_id, openid, status }) {
    const { ctx } = this;
    const currentStatus = await ctx.helper.memberStatus({ team_id });
    if (currentStatus === 2 && status === 1 && team_id === 0) { return; }
    if (status === -1) { // application
      assert(openid === ctx.user.openid);
    } else if (status === 0) {
      assert(openid === ctx.user.openid || currentStatus === 2);
    } else if (status === 1) {
      assert(currentStatus === 2);
    } else {
      assert(false);
    }

    await ctx.app.db.run(`
      REPLACE INTO team_member(team_id, openid, status)
      VALUES (?, ?, ?);
    `, [team_id, openid, status]);

    return { team_id, openid, status };
  }

  async getMember({ team_id }) {
    const { ctx } = this;
    const currentStatus = await ctx.helper.memberStatus({ team_id });
    assert(currentStatus >= 1);
    const res = await ctx.app.db.all(`
      SELECT 
        u.openid, 
        u.alias,
        u.avatar_url as avatarUrl,
        m.status
      FROM team t, team_member m, user u
      WHERE t.team_id = ? AND t.team_id = m.team_id 
        AND u.openid = m.openid AND m.status != 0
      ORDER BY m.status;
    `, [team_id])
    // console.log(res);
    return res;
  }

  async delete({ team_id }) {
    const { ctx } = this;
    const currentStatus = await ctx.helper.memberStatus({ team_id });

    assert(currentStatus === 2);

    await ctx.app.db.run(`
      DELETE FROM team
      WHERE team_id = ?;
    `, [team_id]);

    await ctx.app.db.run(`
      DELETE FROM team_member
      WHERE team_id = ?;
    `, [team_id]);

  }

  async get({ is_my }) {
    const { ctx } = this;
    const { openid } = ctx.user;

    const teams = await ctx.app.db.all( `
      SELECT 
        t.team_id AS team_id, 
        t.name AS team_name,
        m.status AS status
      FROM team t
        LEFT JOIN (
          SELECT * FROM team_member tm
          WHERE tm.openid = ?
        ) m
        ON t.team_id = m.team_id;
    `, [openid]);
    // console.log(teams, is_my)
    if (is_my) {
      return teams.filter(e => (e.status && e.status !== 0));
    } else {
      return teams;
    }
  }
};

module.exports = TeamService;