const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const NarrowSpecializationSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			lowercase: true,
			unique: true
		},
		id_majors: {
			type: ObjectId,
			require,
			ref: 'Major'
		},
		campus: {
			type: String,
			required: true,
			ref: 'Campus'
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('NarrowSpecialization', NarrowSpecializationSchema);
