const mongoose = require('mongoose');
import moment from 'moment';

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

// Cập nhật timezone
// configTimeSchema.pre('save', (next) => {
// 	const correctedStartTime = moment().tz(this.startTime, 'Asia/Ho_Chi_Minh').format();
// 	const correctedEndTime = moment().tz(this.endTime, 'Asia/Ho_Chi_Minh').format();

// 	this.startTime = correctedStartTime;
// 	this.endTime = correctedEndTime;

// 	next();
// });

configTimeSchema.index({ semester_id: 1, typeNumber: 1 }, { unique: true });

// Xoá thơi gian đã hết hạn
//! Sai nghiệp vụ. DEPRECATED
// configTimeSchema.statics.removeExpired = async function () {
// 	const now = new Date().getTime();
// 	const docs = await this.find({ endTime: { $lt: now } });
// 	if (docs.length) {
// 		const ids = docs.map((doc) => doc._id);
// 		await this.deleteMany({ _id: { $in: ids } });
// 	}
// };

module.exports = mongoose.model('ConfigTime', configTimeSchema);
