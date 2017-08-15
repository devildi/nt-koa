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
	fetch: function(cb) {
		return this
			.find({completedorNot: 1})
      .populate('user')
      .sort({'meta.updateAt':-1})
      .exec(cb)
	}
}

module.exports = mongoose.model('Route', RouteSchema)