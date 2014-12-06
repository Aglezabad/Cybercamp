var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Log = new Schema({
	date: Date,
	uri: String,
	status: String,
	reason: {type: Schema.ObjectId, ref: 'Filter'}
});

module.exports = mongoose.model('Log', Log);