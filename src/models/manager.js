const mongoose = require('mongoose');
const managerSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	campus: {
		type: mongoose.Schema.ObjectId,
		ref: 'Cumpus',
		required: true,
		autopopulate: true,
	},
	role: {
		type: Number,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

managerSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Manager', managerSchema);
