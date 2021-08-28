'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const auth = middleware.auth();
  router.get('/', controller.home.index);
  router.post('/login', controller.home.login);
  router.post('/user/update', auth, controller.home.updateUser);
  router.post('/user/get', auth, controller.home.getUser);
  router.post('/step/update', auth, controller.home.updateStep);
  router.post('/step/get', auth, controller.home.getStep);
  router.post('/step/like', auth, controller.home.likeStep);
  router.post('/team/get', auth, controller.home.getTeam);
  router.post('/team/create', auth, controller.home.createTeam);
  router.post('/team/updateMember', auth, controller.home.updateMember);
  router.post('/team/getMember', auth, controller.home.getMember);
  router.post('/team/update', auth, controller.home.updateTeam);
  router.post('/team/delete', auth, controller.home.deleteTeam);
};

// replace into team_member(team_id, openid, status) values(504779970,"o-UCN6jHhbWBPfW5YPvCwaGIj7NY",0);