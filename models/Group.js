var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Group = new Schema({
	name: String,
	users: [{type: Schema.ObjectId, ref: 'User'}],
	filters: [{type: Schema.ObjectId, ref: 'Filter'}]
});

module.exports = mongoose.model('Group', Group);