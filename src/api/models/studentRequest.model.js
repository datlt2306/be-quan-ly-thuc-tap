import mongoose from 'mongoose';
import mongooseAutoPopulate from 'mongoose-autopopulate';

const StudentRequestSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.Types.ObjectId,
			ref: 'Student',
			autopopulate: { select: 'name email mssv' }
		},
		description: {
			type: String,
			required: true
		},
		type: {
			type: String,
			required: true
		},
		status: {
			type: Number,
			default: 1
		},
		createAt: {
			type: Date,
			default: Date.now
		}
	},
	{
		timestamps: true,
		versionKey: false,
		collection: 'student_requests'
	}
);

StudentRequestSchema.plugin(mongooseAutoPopulate);

export default mongoose.model('student_requests', StudentRequestSchema);
