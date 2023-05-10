const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { ObjectId } = mongoose.Schema;
const businessSchema = mongoose.Schema({
	name: {
		type: String,
		require: true,
		lowercase: true,
	},
	internshipPosition: {
		type: String,
		require: true,
	},
	major: {
		type: ObjectId,
		ref: 'Major',
		require: true,
	},
	amount: {
		type: Number,
		default: 0,
	},
	address: {
		type: String,
	},
	semester_id: {
		type: ObjectId,
		ref: 'Semester',
	},
	campus_id: {
		type: ObjectId,
		ref: 'Campus',
	},
	code_request: {
		type: String,
		unique: true,
		require: true,
	},
	request: {
		type: String,
	},
	description: {
		type: String,
	},
	benefit: {
		type: String,
	},
	status: {
		type: Number,
		default: 1,
	},
	createAt: {
		type: Date,
		default: Date.now,
	},
});

businessSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Business', businessSchema);
