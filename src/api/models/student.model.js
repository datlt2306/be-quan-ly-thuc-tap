const mongoose = require('mongoose');
const mongooseAutoPopulate = require('mongoose-autopopulate');
const mongoosePaginate = require('mongoose-paginate-v2');
const { ObjectId } = mongoose.Schema;
const studentSchema = mongoose.Schema(
	{
		mssv: {
			require: true,
			type: String,
			uppercase: true,
		},
		name: {
			type: String,
			require: true,
		},
		course: {
			type: String,
		},
		majorCode: {
			type: String,
			require: true,
		},
		narrow: {
			type: ObjectId,
			ref: 'NarrowSpecialization',
			autopopulate: true,
		},
		dream: {
			type: String,
			default: null,
		},
		email: {
			type: String,
			require: true,
		},
		supplement: {
			type: String,
			default: null,
		},
		statusCheck: {
			type: Number,
			default: 10,
		},
		statusStudent: {
			type: String,
			enum: ["HDI","HL","CHO","TN"],
			uppercase:true
		},
		support: {
			type: Number,
			default: null,
		},
		phoneNumber: {
			type: String,
			require: true,
			minLength: 10,
			maxLength: 11,
			default: null,
		},
		address: {
			type: String,
			default: null,
		},
		CV: {
			type: String,
			default: null,
		},
		campus_id: {
			type: ObjectId,
			ref: 'Campus',
		},
		business: {
			type: ObjectId,
			ref: 'Business',
			default: null,
			autopopulate: true,
		},
		smester_id: {
			type: ObjectId,
			ref: 'Semester',
			autopopulate: true,
		},
		reviewer: {
			type: String,
			default: null,
		},
		updatedInStage: {
			type: Number,
			enum: [1, 2, 3],
			default: 1,
		},
		form: {
			type: String,
			default: null,
		},
		report: {
			type: String,
			default: null,
		},
		note: {
			type: String,
			default: '',
		},
		numberOfTime: {
			type: Number,
			default: 0,
		},
		//cong ty
		nameCompany: {
			type: String,
			default: null,
		},
		addressCompany: {
			type: String,
			default: null,
		},
		taxCode: {
			type: String,
			default: null,
		},
		position: {
			type: String,
			default: null,
		},
		phoneNumberCompany: {
			type: String,
			default: null,
		},
		emailEnterprise: {
			type: String,
			default: null,
		},
		// bieu mau
		internshipTime: {
			type: Date,
			default: null,
		},
		endInternShipTime: {
			type: Date,
		},
		attitudePoint: {
			type: Number,
		},
		resultScore: {
			type: Number,
			default: null,
		},
		listTimeForm: [
			{
				typeNumber: {
					type: Number,
				},
				typeName: {
					type: String,
					default: '',
				},
				startTime: {
					type: Number,
				},
				endTime: {
					type: Number,
				},
			},
		],
		signTheContract: {
			type: Number,
			default: null,
		},
	},
	{
		timestamps: true,
		strictPopulate: false,
	}
);

studentSchema.virtual('major', {
	localField: 'majorCode',
	foreignField: 'majorCode',
	ref: 'Major',
});

studentSchema.plugin(mongoosePaginate);
studentSchema.plugin(mongooseAutoPopulate);
module.exports = mongoose.model('Student', studentSchema);
