import { model, Schema } from 'mongoose';
const { ObjectId } = Schema;

const StatusSchema = Schema(
	{
		value: {
			type: Number,
			required: true
		},
		title: {
			type: String,
			required: true
		},
		contentMail: {
			type: String,
			required: true
		},
		titleMail: {
			type: String,
			required: true
		},
		campus: {
			type: ObjectId,
			required: true,
			ref: 'Campus'
		}
	},
	{
		timestamps: true
	}
);

const StatusStudentModel = model('statusStudent', StatusSchema);

export default StatusStudentModel;
