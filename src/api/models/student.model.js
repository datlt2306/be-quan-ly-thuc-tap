import mongoose from 'mongoose';
import mongooseAutoPopulate from 'mongoose-autopopulate';
import mongoosePaginate from 'mongoose-paginate-v2';

const studentSchema = new mongoose.Schema(
	{
		mssv: {
			required: true,
			type: String,
			uppercase: true,
			unique: true
		},
		name: {
			type: String,
			required: true
		},
		course: {
			type: String
		},
		majorCode: {
			type: String,
			required: true
		},
		narrow: {
			type: mongoose.Types.ObjectId,
			ref: 'NarrowSpecialization',
			autopopulate: true
		},
		dream: {
			type: String,
			default: null
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true
		},
		supplement: {
			type: String,
			default: null
		},
		statusCheck: {
			type: Number,
			default: 10
		},
		statusStudent: {
			type: String,
			enum: ['HDI', 'HL', 'CHO', 'TN'],
			uppercase: true
		},
		support: {
			type: Number,
			default: null
		},
		phoneNumber: {
			type: String,
			required: true,
			minLength: 10,
			maxLength: 11,
			default: null
		},
		address: {
			type: String,
			default: null
		},
		CV: {
			type: String,
			default: null
		},
		campus_id: {
			type: mongoose.Types.ObjectId,
			ref: 'Campus'
		},
		business: {
			type: mongoose.Types.ObjectId,
			ref: 'Business',
			default: null,
			autopopulate: true
		},
		smester_id: {
			type: mongoose.Types.ObjectId,
			ref: 'Semester',
			autopopulate: true
		},
		reviewer: {
			type: String,
			default: null
		},
		form: {
			type: String,
			default: null
		},
		report: {
			type: String,
			default: null
		},
		note: {
			type: String,
			default: ''
		},
		numberOfTime: {
			type: Number,
			default: 0
		},
		// cong ty
		nameCompany: {
			type: String,
			default: null
		},
		employer: {
			type: String,
			default: null
		},
		addressCompany: {
			type: String,
			default: null
		},
		taxCode: {
			type: String,
			default: null
		},
		position: {
			type: String,
			default: null
		},
		phoneNumberCompany: {
			type: String,
			default: null
		},
		emailEnterprise: {
			type: String,
			default: null
		},
		// bieu mau
		internshipTime: {
			type: Date,
			default: null
		},
		endInternShipTime: {
			type: Date
		},
		attitudePoint: {
			type: Number
		},
		resultScore: {
			type: Number,
			default: null
		},
		signTheContract: {
			type: Number,
			default: null
		}
	},
	{
		timestamps: true,
		strictPopulate: false,
		toJSON: { virtuals: true }
	}
);

studentSchema.virtual('major', {
	localField: 'majorCode',
	foreignField: 'majorCode',
	justOne: true,
	ref: 'Major'
});

studentSchema.plugin(mongoosePaginate);
studentSchema.plugin(mongooseAutoPopulate);
export default mongoose.model('Student', studentSchema);
