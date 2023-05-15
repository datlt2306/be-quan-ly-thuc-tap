const mongoose = require('mongoose');
const campusSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('Campus', campusSchema);
