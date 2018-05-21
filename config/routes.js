'use strict'

var Router = require('koa-router')

var Index = require('../app/controllers/index')

module.exports = function() {
	var router = new Router()
	
	router.get('/', Index.index)
	
	//router.get('/api/edit', Index.edit)
	//router.get('/api/google', Index.google)
	//router.get('/api/gaode', Index.gaode)

	router.post('/api/admin/post', Index.post)
	router.post('/api/admin/save', Index.save)
	router.get('/api/admin/get', Index.get)
	router.get('/api/admin/all', Index.all)
	router.get('/api/admin/upload', Index.upload)
	return router
}