const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const NarrowSpecializationSchema = mongoose.Schema(
	{
		name: {
			type: String,
			require: true,
			lowercase: true,
			unique: true,
		},
		major: {
			type: ObjectId,
			require,
			ref: 'Major',
		},
		campus: {
			type: String,
			require: true,
			ref: 'Cumpus',
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('NarrowSpecialization', NarrowSpecializationSchema);
