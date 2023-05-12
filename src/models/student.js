const mongoose = require('mongoose');
const mongooseAutoPopulate = require('mongoose-autopopulate');
const mongoosePaginate = require('mongoose-paginate-v2');
const { ObjectId } = mongoose.Schema;
const studentSchema = mongoose.Schema(
	{
		mssv: {
			require: true,
			type: String,
			lowercase: true,
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
		checkUpdate: {
			type: Boolean,
			default: true,
		},
		checkMulti: {
			type: Boolean,
			default: false,
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
		},
		support: {
			type: Number,
			default: null,
		},
		phoneNumber: {
			type: Number,
			require: true,
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
			ref: 'Cumpus',
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
			default: null,
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
			type: Number,
			default: null,
		},
		position: {
			type: String,
			default: null,
		},
		phoneNumberCompany: {
			type: Number,
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
			default: null,
		},
		attitudePoint: {
			type: Number,
			default: null,
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
		createdAt: {
			type: Date,
			default: Date.now,
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
