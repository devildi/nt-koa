const mongoose = require('mongoose')
const Route = mongoose.model('Route')
const Cat = mongoose.model('Cat')
//var rp = require('request-promise')
// exports.index = function*(next){
	// const that =this
	// yield rp('https://api.ip138.com/query/?token=0f0ab4f9ed7bf159be46e875be6a3479')
 //  .then(function (res) {
 //    let data = JSON.parse(res).data[0]
 //    console.log(data)
 //    if( data === '中国'){
 //      that.redirect('api/gaode')
 //    } else{
 //    	that.redirect('api/google')
 //    }
 //  })
 //  .catch(function (err) {
 //    console.log(err)
 //  })
//  this.redirect('api/gaode')
// }

// exports.google = function*(next){
// 	yield this.render('index', {})
// }

// exports.gaode = function*(next){
// 	yield this.render('gaode/index', {})
// }

// exports.edit = function*(next){
// 	yield this.render('edit/index', {})
// }

exports.post = function*(next){
	let user = this.request.body.name
	let indexOfDay = this.request.body.indexOfDay
	let route = this.request.body.cache
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
	let routes = null
	let play = []
  let play2 = []
  let line = []
	let dinner = []
	let hotel = []
	if(!indexOfDay){
		routes = yield Route.find({user: name}).exec()
	} else {
		routes = yield Route.find({user: name, indexOfDay: indexOfDay}).exec()
	}
	if(routes){
		routes.map((item, index) => {
			if (item.route && item.route.length > 0){
				item.route.map((item, index) => {
	      let obj = JSON.parse(item.location)
	      obj.lat = parseFloat(obj.lat)
	      obj.lng = parseFloat(obj.lng)
	      item.location = obj
	      //点数据分类
	      if(item.pointOrNot === '1' && item.category === '0'){
	        play2.push(item)
	      } else if(item.pointOrNot === '1' && item.category === '1'){
	        dinner.push(item)
	      } else if(item.pointOrNot === '1' && item.category === '2'){
	        hotel.push(item)
	      } else{
	        line.push(item)
	      }
	    })
			}
		})
	}
	this.body = {
		data: routes,
		data1: play2
	}
}

exports.save = function*(next){
	let route = null
	let arrs = this.request.body.cache
	console.log('save', arrs)
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
	let name = this.query.name
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
