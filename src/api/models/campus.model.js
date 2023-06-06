import mongoose from 'mongoose';

const CampusSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			lowercase: true
		}
	},
	{
		timestamps: true,
		versionKey: false
	}
);

const CampusModel = mongoose.model('Campus', CampusSchema);

export default CampusModel;
