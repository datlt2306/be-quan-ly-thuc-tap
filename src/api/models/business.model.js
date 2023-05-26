const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { ObjectId } = mongoose.Schema;
const businessSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	internship_position: {
		type: String,
		required: true
	},
	major: {
		type: ObjectId,
		ref: 'Major',
		required: true
	},
	amount: {
		type: Number,
		default: 0
	},
	address: {
		type: String
	},
	semester_id: {
		type: ObjectId,
		ref: 'Semester'
	},
	campus_id: {
		type: ObjectId,
		ref: 'Campus'
	},
	tax_code: {
		type: String,
		required: true
	},
	business_code: {
		type: String,
		required: true
	},
	requirement: {
		type: String
	},
	description: {
		type: String
	},
	benefit: {
		type: String
	},
	status: {
		type: Number,
		default: 1
	},
	created_at: {
		type: Date,
		default: Date.now
	}
});

businessSchema.index({ tax_code: 1, business_code: 1, campus_id: 1 }, { unique: true });
businessSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Business', businessSchema);
