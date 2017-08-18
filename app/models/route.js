const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RouteSchema = new Schema({
	user: String,
	indexOfDay: String,
	date: Date,
	route: Schema.Types.Mixed
})

RouteSchema.pre('save', function(next) {
	next()
})

RouteSchema.statics = {
	fetch: function(str1, str2, cb) {
		return this
			.find({user: str1})
			.find({indexOfDay: str2})
     // .populate('user')
      .exec(cb)
	}
}

module.exports = mongoose.model('Route', RouteSchema)