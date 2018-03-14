'use strict'

const mongoose = require('mongoose')
const Route = mongoose.model('Route')
var rp = require('request-promise')
exports.index = function*(next){
	const that =this
	yield rp('https://api.ip138.com/query/?token=0f0ab4f9ed7bf159be46e875be6a3479')
  .then(function (res) {
    let data = JSON.parse(res).data[0]
    console.log(data)
    if( data === '中国'){
      that.redirect('api/gaode')
    } else{
    	that.redirect('api/google')
    }
  })
  .catch(function (err) {
    console.log(err)
  })
}

exports.google = function*(next){
	yield this.render('index', {})
}

exports.gaode = function*(next){
	yield this.render('gaode/index', {})
}

exports.edit = function*(next){
	yield this.render('edit/index', {})
}

exports.post = function*(next){
	let _route = null
	let route = null
	_route = new Route({
		user: this.request.body.name,
		indexOfDay: this.request.body.indexOfDay,
		date: this.request.body.date,
		route: this.request.body.cache
	})
	try{
		route = yield _route.save()
	}
	catch(err){
		console.log(err)
		this.body = {success: false}
		return next
	}
	this.body = {
		success: true
	}
}

exports.get = function*(next){
	let name = this.query.name
	let indexOfDay = this.query.indexOfDay
	let routes = null
	if(!indexOfDay){
		routes = yield Route.find({user: name}).exec()
	} else {
		routes = yield Route.find({user: name, indexOfDay: indexOfDay}).exec()
	}
	this.body = {
		data: routes
	}
}

exports.save = function*(next){
	let route = null
	let arrs = this.request.body.cache
	let Parr = []
	let Parr1 = []
	let dataArr = []
	arrs.map((r, i) => {
		Parr.push(Route.find({user: r.user, indexOfDay: r.indexOfDay}))
	})
	let data = yield Promise.all(Parr)
	data.map((r, i) => {dataArr.push(r[0])})
	dataArr.map((r, i) => {
		r.route = arrs[i].route
		Parr1.push(r.save())
	})
	this.body = yield Promise.all(Parr1)
}