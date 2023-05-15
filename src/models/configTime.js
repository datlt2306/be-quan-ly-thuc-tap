const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const configTimeSchema = mongoose.Schema(
	{
		typeNumber: {
			type: Number,
			required: true,
		},
		typeName: {
			type: String,
			required: true,
		},
		startTime: {
			type: Number,
			required: true,
		},
		endTime: {
			type: Number,
			required: true,
		},
		semester_id: {
			type: ObjectId,
			ref: 'Semester',
		},
		campus_id: {
			type: ObjectId,
			ref: 'Campus',
		},
	},
	{
		timestamps: true,
	}
);

configTimeSchema.statics.removeExpired = async function () {
	const now = new Date().getTime();
	const docs = await this.find({ endTime: { $lt: now } });
	if (docs.length) {
		const ids = docs.map((doc) => doc._id);
		await this.deleteMany({ _id: { $in: ids } });
	}
};

module.exports = mongoose.model('ConfigTime', configTimeSchema);
