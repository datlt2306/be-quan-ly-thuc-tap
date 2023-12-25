const mongoose = require('mongoose');

const managerSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	campus_id: {
		type: mongoose.Schema.ObjectId,
		ref: 'Campus',
		required: true,
		autopopulate: true
	},
	role: {
		type: Number,
		required: true
	},
	applicationPassword: {
		type: String,
		trim: true,
		default: null
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

managerSchema.plugin(require('mongoose-paginate-v2'));
managerSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Manager', managerSchema);
