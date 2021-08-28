create table login (openid text primary key not null, session_key text not null);
create table step (openid text not null, date date not null, step int not null, primary key (openid, date));
create table user (openid text primary key not null, nickname text not null, alias text, avatar_url text not null);
create table team (team_id INTEGER PRIMARY KEY, name text not null);
create table team_member (team_id INTEGER not null, openid text not null, status integer not null, primary key (team_id, openid));
-- status: 0: deleted, -1: pending application, 1: member, 2: admin
create table step_like (givr_openid text not null, recv_openid text not null, date date not null, state int, primary key (givr_openid, recv_openid, date));
-- state: 0 / 1


insert into team (team_id, name) values (0, '大本营');
-- UPDATE team_member SET status = 2 WHERE team_id = 0 AND openid = '';