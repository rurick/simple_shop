'use strict'
const _ = require("underscore");
const BaseController = require("./Base");
const View = require("../views/Base");
const Rubric = require("../models/Rubric");

module.exports = BaseController.extend({ 
	name: "AdminRubric",
	content: null,
	list: async function(req, res, next) {
		//вывод списка 
        const v = new View(res, 'admin/rubrics.html');
        const rubrics = await Rubric.all();
        v.render({
            page: 'rubrics',
            objects: rubrics,
            req: req
        });
    },
    
    get: async function(req, res, next) {
        const id = req.params.id;
        const v = new View(res, 'admin/rubric.html');
        v.render({
            page: 'rubrics',
            object: await Rubric.get(id),
            req: req,
            showdel: true
        });
    },

    add: async function (req, res, next) {
        const v = new View(res, 'admin/rubric.html');
        v.render({
            page: 'rubrics',
            addrubric: true,
            req: req
        });
    },

    do_del: function (req, res, next) {
        const id = req.params.id;
        Rubric.delete(id);
        return res.redirect('/admin/rubrics');
    },

    do_add: function (req, res, next) {
        const r = Rubric.create(req.body)
        .then((rubric) => {
            res.redirect('/admin/rubrics/' + rubric._id);
        })
        .catch((err) => {
            const v = new View(res, 'admin/rubric.html');
            return v.render({
                page: 'rubrics',
                object: req.body,
                addrubric: true,
                req: req,
                error: err.message
            });    
        });
        return r;
    },

    
    do_edit: function (req, res, next) {
        const id = req.params.id;
        const rubric = Rubric.update(_.extend({}, {_id: id}, req.body))
        .then((rubric) => {
            res.redirect('/admin/rubrics/' + rubric._id);
        });
        return rubric;
    },
});