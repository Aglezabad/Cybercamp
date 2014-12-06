var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
	email: {type: String, required: true},
	group: {type: Schema.ObjectId, ref: 'Group'},
	contacts: [{type: Schema.ObjectId, ref: 'Contact'}],
	logs: [{type: Schema.ObjectId, ref: 'Log'}],
	groupAdmin: Boolean
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);