import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseAutoPopulate from 'mongoose-autopopulate';

const businessSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		internship_position: {
			type: String,
			required: true
		},
		major: {
			type: mongoose.Types.ObjectId,
			ref: 'Major',
			required: true,
			autopopulate: true
		},
		amount: {
			type: Number,
			default: 0
		},
		address: {
			type: String
		},
		semester_id: {
			type: mongoose.Types.ObjectId,
			ref: 'Semester',
			autopopulate: true
		},
		campus_id: {
			type: mongoose.Types.ObjectId,
			ref: 'Campus',
			autopopulate: true
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
		}
	},
	{
		timestamps: true,
		versionKey: false,
		toJSON: { virtuals: true }
	}
);

businessSchema.index({ tax_code: 1, business_code: 1, campus_id: 1 }, { unique: true });
businessSchema.plugin(mongoosePaginate);
businessSchema.plugin(mongooseAutoPopulate);

export default mongoose.model('Business', businessSchema);
