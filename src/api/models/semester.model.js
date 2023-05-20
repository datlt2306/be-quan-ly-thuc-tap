const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const semesterSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		lowercase: true,
	},
	start_time: {
		type: Date,
	},
	end_time: {
		type: Date,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	campus_id: {
		type: ObjectId,
		ref: 'Campus',
	},
});

module.exports = mongoose.model('Semester', semesterSchema);
