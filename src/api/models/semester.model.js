const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;
const semesterSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true
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

semesterSchema.index({ campus_id: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Semester', semesterSchema);
