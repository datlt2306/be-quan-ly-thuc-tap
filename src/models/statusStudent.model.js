import { model, Schema } from 'mongoose';
const { ObjectId } = Schema;

const StatusSchema = Schema(
	{
		value: {
			type: Number,
			unique: true,
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
		campus: {
			type: ObjectId,
			require: true,
			ref: 'Cumpus',
		},
	},
	{
		timestamps: true,
	}
);

const StatusStudentModel = model('statusStudent', StatusSchema);

export default StatusStudentModel;
