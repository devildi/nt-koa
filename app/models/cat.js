const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const CatSchema = new Schema({
	all:[]
})

CatSchema.pre('save', function(next) {
	next()
})

module.exports = mongoose.model('Cat', CatSchema)