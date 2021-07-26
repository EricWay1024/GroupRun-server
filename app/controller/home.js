'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'This page is intentionally left blank.';
  }

  async login () {
    const { ctx, service } = this;
    const { code } = ctx.request.body;
    const token = await service.login.index({ code });
    ctx.body = { token };
  }
  
  async updateStep () {
    const { ctx } = this;
    const { encryptedData, iv } = ctx.request.body;
    const decryptedData = await ctx.service.step.decrypt({ encryptedData, iv });
    await ctx.service.step.update(decryptedData);
    ctx.status = 200;
  }

  async getStep () {
    const { ctx } = this;
    const { date, team_id } = ctx.request.body;
    const stepData = await ctx.service.step.get({ date, team_id });
    ctx.body = { stepData };
  }

  async updateUser() {
    const { ctx } = this;
    const { nickname, avatarUrl, alias } = ctx.request.body;
    const newUser = await ctx.service.user.update({ nickname, avatarUrl, alias });
    ctx.body = newUser;
  }

  async getUser() {
    const { ctx } = this;
    ctx.body = await ctx.service.user.get();
  }

  async getTeam() {
    const { ctx } = this;
    const { is_my } = ctx.request.body;
    ctx.body = {
      teamList: await ctx.service.team.get({ is_my })
    };
  }

  async createTeam() {
    const { ctx } = this;
    const { name } = ctx.request.body;
    ctx.body = {
      team_id: await ctx.service.team.create({ name })
    }
  }

  async updateTeam() {
    const { ctx } = this;
    const { team_id, name } = ctx.request.body;
    await ctx.service.team.update({ team_id, name });
    // console.log(team_id, name)
    ctx.status = 200;
  }

  async deleteTeam() {
    const { ctx } = this;
    const { team_id } = ctx.request.body;
    await ctx.service.team.delete({ team_id });
    ctx.status = 200;
  }

  async updateMember() {
    const { ctx } = this;
    const { team_id, openid, status } = ctx.request.body;
    ctx.body = await ctx.service.team.updateMember({
      team_id,
      openid: openid ? openid : ctx.user.openid,
      status
    });
  }

  async getMember() {
    const { ctx } = this;
    const { team_id } = ctx.request.body;
    ctx.body = {
      memberList: await ctx.service.team.getMember({ team_id })
    };
  }
}


module.exports = HomeController;
