const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const majorSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		majorCode: {
			type: String,
			required: true
		},
		campus: {
			type: ObjectId,
			ref: 'Campus'
		},
		createdAt: {
			type: Date,
			default: Date.now
		}
	},
	{
		strictPopulate: false
	}
);

module.exports = mongoose.model('Major', majorSchema);
