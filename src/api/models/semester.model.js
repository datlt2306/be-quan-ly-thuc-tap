const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;
const semesterSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
		unique: true
	},
	start_time: {
		type: Date
	},
	end_time: {
		type: Date
	},
	createdAt: {
		type: Date,
		default: new Date()
	},
	campus_id: {
		type: ObjectId,
		ref: 'Campus'
	}
});

module.exports = mongoose.model('Semester', semesterSchema);
