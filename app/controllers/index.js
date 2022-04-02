const mongoose = require('mongoose')
const Route = mongoose.model('Route')
const Cat = mongoose.model('Cat')
var Util = require('../../utils/util')

exports.index = function*(next){
 	yield this.render('index', {})
}

exports.post = function*(next){
	let user = this.request.body.name
	let indexOfDay = this.request.body.indexOfDay
  //解决[object, Object]异常
	let route = JSON.parse(this.request.body.cache)

	let route11 = yield Route.findOne({user: user}).exec()
	if(!route11){
		let a = null
		a = yield Cat.findOne()
		if(a){
			a.all.push(user)
		} else {
			a = new Cat({
				all: []
			})
			a.all.push(user)
		}
		try{
			 a = yield a.save()
		}
		catch(err){
			console.log(err)
			this.body = {success: false}
			return next
		}
	}
	let routes = yield Route.findOne({user: user, indexOfDay: indexOfDay}).exec()
	if(routes){
		route.map((r,i) => {
			routes.route.push(r)
		})
		try{
			routes = yield routes.save()
		}
		catch(err){
			console.log(err)
			this.body = {success: false}
			return next
		}

	} else {
		let _route = new Route({
			user: user,
			tripName: this.request.body.tripName,
			author: this.request.body.author,
			indexOfDay: indexOfDay,
			date: this.request.body.date,
			useGoogle: this.request.body.useGoogle,
			city: this.request.body.city,
			route: route
		})
		try{
			let route = yield _route.save()
		}
		catch(err){
			console.log(err)
			this.body = {success: false}
			return next
		}
	}
	this.body = {
		success: true
	}
}

exports.get = function*(next){
	let name = this.query.name
	let indexOfDay = this.query.indexOfDay
	let from = this.query.from || ''
	let routes = null
	let play = []
  let play2 = []
  let line = []
	let dinner = []
	let hotel = []
	let drawer = []
	let flag= 0
	if(!indexOfDay){
		routes = yield Route.find({user: name}).exec()
	} else {
		routes = yield Route.find({user: name, indexOfDay: indexOfDay}).exec()
	}	
	if(routes && routes.length > 0){
		drawer = JSON.parse(JSON.stringify(routes))
		let isUsingGoogle = routes[0].useGoogle === '1' ? true : false
		routes.map((item, index) => {
			if (item.route && item.route.length > 0){
				item.route.map((r, i) => {
					if(!from){
						if(isUsingGoogle){
							let obj = JSON.parse(r.location)
				      obj.lat = parseFloat(obj.lat)
				      obj.lng = parseFloat(obj.lng)
				      r.location = obj
						} else {
							r.location = JSON.parse(r.location)
						}
					}
	      	//点数据分类
		      if(r.pointOrNot === '1' && r.category === '0'){
		        play2.push(r)
		      } else if(r.pointOrNot === '1' && r.category === '1'){
		        dinner.push(r)
		        if(!from){
		        	drawer[index].route.splice((i - flag),1)
		        	flag++
		        }
		      } else if(r.pointOrNot === '1' && r.category === '2'){
		        hotel.push(r)
		        if(!from){
		        	drawer[index].route.splice((i - flag),1)
		        	flag++
		        }
		      } else{
		        line.push(r)
		      }
	    	})
			}
		})
	}

	this.body = {
		data: from ? routes : drawer,
		//点数据
		data1: play2,
		dinner: dinner,
		hotel: hotel
	}
}

exports.save = function*(next){
	let route1 = null
	let route = null
	let arrs = JSON.parse(this.request.body.cache)
	route1 = yield Route.findOne({user: arrs[0].user}).exec()
	if(route1.city !== arrs[0].city){
		route1.city = arrs[0].city
		route1 = yield route1.save()
	}
	let Parr = []
	let Parr1 = []
	let dataArr = []
	arrs.map((r, i) => {
		Parr.push(Route.find({user: r.user, indexOfDay: r.indexOfDay}))
	})
	let data = yield Promise.all(Parr)
	data.map((r, i) => {dataArr.push(r[0])})
	dataArr.map((r, i) => {
		r.date = arrs[i].date
		r.indexOfDay = arrs[i].indexOfDay
		r.route = arrs[i].route
		Parr1.push(r.save())
	})
	this.body = yield Promise.all(Parr1)
}

exports.all = function*(next){
	let name = this.query.name || ''
	let data1 = []
	let promiseContainer = []
	let a = yield Cat.findOne()
	if(a){
		a.all.map((row, index) => {
			if(row === name) {
				a.all.splice(index, 1)
			}
		})
		a.all.map((r, i) => {
			promiseContainer.push(Route.find({user: r}))
		})
		let data = yield Promise.all(promiseContainer)
		data.map((r) => {
			data1.push(r[0])
		})
		this.body = {
			data: data1
		}
	} else{
		this.body = {
			data: null
		}
	}
}

exports.upload = function*(next){
	let result = yield Util.uploadPromise(this.query.picURL)
	this.body = {
		data: result.secure_url
	}
}
