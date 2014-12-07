var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	username: {type: String, required: true},
	password: {type: String, required: true},
	email: {type: String, required: true},
	disphash: [{type: String, unique: true}],
	group: {type: Schema.ObjectId, ref: 'Group'},
	contacts: [{type: Schema.ObjectId, ref: 'Contact'}],
	logs: [{type: Schema.ObjectId, ref: 'Log'}],
	groupAdmin: {type: Boolean, default: false}
});

module.exports = mongoose.model('User', User);