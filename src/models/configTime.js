const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const configTimeSchema = mongoose.Schema(
	{
		typeName: {
			type: String,
			require: true,
		},
		startTime: {
			type: Number,
			required: true,
		},
		endTime: {
			type: Number,
			required: true,
		},
		semester_id: {
			type: ObjectId,
			ref: 'Semester',
		},
		campus_id: {
			type: ObjectId,
			ref: 'Cumpus',
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('ConfigTime', configTimeSchema);
