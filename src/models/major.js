const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const majorSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	majorCode: {
		type: String,
		require: true,
	},
	campus: {
		type: ObjectId,
		ref: 'Cumpus',
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('Major', majorSchema);
