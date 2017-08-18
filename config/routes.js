'use strict'

var Router = require('koa-router')

var Index = require('../app/controllers/index')

module.exports = function() {
	var router = new Router({
		prefix: '/api'
	})

	router.get('/', Index.index)
	router.get('/edit', Index.edit)

	router.post('/admin/post', Index.post)
	router.post('/admin/save', Index.save)
	router.get('/admin/get', Index.get)

	return router
}