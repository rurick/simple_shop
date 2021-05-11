'use strict'
const _ = require("underscore");
const BaseController = require("./Base");
const View = require("../views/Base");
const User = require("../models/User");

module.exports = BaseController.extend({
	name: "AdminUsers",
	content: null,
	list: async function(req, res, next) {
		//вывод списка пользователей
        const v = new View(res, 'admin/users.html');
        const users = await User.all();
        v.render({
            page: 'users',
            objects: users,
            req: req
        });
    },
    
    get: async function(req, res, next) {
        const id = req.params.id;
        const v = new View(res, 'admin/user.html');
        v.render({
            page: 'users',
            object: await User.get(id),
            req: req,
            showdel: true
        });
    },

    add: function (req, res, next) {
        const v = new View(res, 'admin/user.html');
        v.render({
            page: 'users',
            adduser: true,
            req: req
        });
    },

    do_del: function (req, res, next) {
        const id = req.params.id;
        User.delete(id);
        return res.redirect('/admin/users');
    },

    do_add: function (req, res, next) {
        const u = User.create(req.body)
        .then((user) => {
            res.redirect('/admin/users/' + user._id);
        })
        .catch((err) => {
            const v = new View(res, 'admin/user.html');
            return v.render({
                page: 'users',
                object: req.body,
                adduser: true,
                req: req,
                error: err.message
            });    
        });
        return u;
    },

    do_edit: function (req, res, next) {
        const id = req.params.id;
        const user = User.update(_.extend({}, {_id: id}, req.body))
        .then((user) => {
            res.redirect('/admin/users/' + user._id);
        })
        .catch((err) => {
            const v = new View(res, 'admin/user.html');
            return v.render({
                page: 'users',
                object: req.body,
                adduser: true,
                req: req,
                error: err.message
            });
        });
        return user;
    },
});