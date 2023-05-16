import { model, Schema } from 'mongoose';
const { ObjectId } = Schema;

const StatusSchema = Schema(
	{
		value: {
			type: Number,
			require: true,
		},
		title: {
			type: String,
			require: true,
		},
		contentMail: {
			type: String,
			require: true,
		},
		titleMail: {
			type: String,
			require: true,
		},
		campus: {
			type: ObjectId,
			require: true,
			ref: 'Campus',
		},
	},
	{
		timestamps: true,
	}
);

const StatusStudentModel = model('statusStudent', StatusSchema);

export default StatusStudentModel;
