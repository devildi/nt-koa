'use strict'

var fs = require('fs')
var path = require('path')
var mongoose = require('mongoose')
var views = require('koa-views')
var staticServer = require('koa-static')
var db = 'mongodb://woody:41538bc6dd@127.0.0.1:27017/nt'

mongoose.connect(db,{useMongoClient: true})
mongoose.Promise = require('bluebird')

var model_path = path.join(__dirname, './app/models')
var walk = function(modelPath){
	fs
		.readdirSync(modelPath)
		.forEach(function(item){
			var filePath = path.join(modelPath ,'/' + item)
			var stat = fs.statSync(filePath)
			if(stat.isFile()) {
					require(filePath)
				} 
				else if (stat.isDirectory()) {
					walk(filePath)
			}
		})
}
walk(model_path)

var koa = require('koa')
var logger = require('koa-logger')
var session = require('koa-session')
var bodyParser = require('koa-bodyparser')

var app = new koa()

app.keys = ['387694318']
app.use(logger())
app.use(session(app))
app.use(bodyParser())
app.use(views(__dirname + '/views', {
  extension: 'jade'
}))
app.use(staticServer(__dirname + '/views'))

var router = require('./config/routes')()
//middlemare for 404
app.use(function*(next){  
  yield next
  if(parseInt(this.status) === 404){
     this.redirect('/')
  }
})

app
	.use(router.routes())
	.use(router.allowedMethods())

app.listen(3000)
console.log('Listening port:3000')