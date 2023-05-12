import semester from '../models/semester';
export const getSemester = async (req, res) => {
	const { campus_id } = req.query;
	try {
		const data = await semester.find({ campus_id }).sort({ createdAt: -1 });
		const dataDefault = await semester.findOne({
			$and: [{ start_time: { $lte: new Date() } }, { end_time: { $gte: new Date() } }],
			campus_id,
		});
		res.status(200).json({ defaultSemester: dataDefault, listSemesters: data });
	} catch (error) {
		res.status(400).json(error);
	}
};

export const getDefaultSemester = async (req, res) => {
	try {
		const { campus_id } = req.query;
		const data = await semester.findOne({
			$and: [{ start_time: { $lte: new Date() } }, { date_time: { $gte: new Date() } }],
			campus_id,
		});
		console.log(data);
		res.status(200).json({
			result: data,
			success: true,
			status: 'ok',
		});
	} catch (error) {
		res.status(400).json({
			result: {},
			message: error,
			success: false,
			status: 'failed',
		});
	}
};

export const updateSemester = async (req, res) => {
	try {
		const query = { _id: req.params.id };
		const reqName = req.body.name.toLowerCase();
		const check = await semester.findOne({
			$and: [{ _id: { $ne: req.params.id, $exists: true } }, { name: reqName }],
		});
		if (!reqName) {
			return res.status(400).json({
				message: 'Bạn phải nhập tên kỳ',
			});
		}
		if (check) {
			return res.status(400).json({
				message: 'Tên kì đã tồn tại, vui lòng thử lại',
			});
		}
		const data = await semester.findOneAndUpdate(query, req.body, {
			new: true,
		});
		return res.status(200).json(data);
	} catch (error) {
		res.status(500).json({
			message: 'Có lỗi vui lòng thử lại sau',
		});
	}
};

export const insertSemester = async (req, res) => {
	try {
		const reqName = req.body.name.toLowerCase();
		const findName = await semester.findOne({
			name: reqName,
			campus_id: req.body.campus_id,
		});

		if (findName) {
			return res.status(400).json({
				code: 400,
				message: 'Tên kỳ đã tồn tại, vui lòng đặt tên khác!',
			});
		}
		const data = await new semester(req.body).save();
		res.status(200).json(data);
	} catch (error) {
		console.log(error);
	}
};

export const getCurrentSemester = async (campus) => {
	try {
		const dataDefault = await semester.findOne({
			$and: [{ start_time: { $lte: new Date() } }, { end_time: { $gte: new Date() } }],
			campus_id: campus,
		});

		return dataDefault;
	} catch (error) {
		throw error;
	}
};
