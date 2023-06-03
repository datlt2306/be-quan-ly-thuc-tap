import Campus from '../models/campus.model';

export const createCampus = async (req, res) => {
	const campusValid = await Campus.findOne({
		name: req.body.name
	});
	try {
		if (campusValid !== null) {
			res.status(202).json({
				success: false,
				message: 'Cơ sở đã tồn tại'
			});
			return;
		} else {
			const campus = await Campus.create(req.body);
			return res.status(200).json({
				campus,
				success: true,
				message: 'Thành công'
			});
		}
	} catch (error) {
		return res.status(400).json(error);
	}
};

export const getListCampus = async (req, res) => {
	try {
		const listCampus = await Campus.find().sort({ createdAt: -1 }).exec();
		return res.status(200).json(listCampus);
	} catch (error) {
		return res.status(400).json(error);
	}
};

export const getCampus = async (req, res) => {
	try {
		const campus = await Campus.findById(req.params.id);
		return res.status(200).json({
			campus,
			message: 'Get campus successfully'
		});
	} catch (error) {
		return res.status(400).json(error);
	}
};

export const updateCampus = async (req, res) => {
	const campusValid = await Campus.findOne({
		name: req.body.name
	});
	try {
		if (campusValid !== null) {
			res.status(202).json({
				success: false,
				message: 'Cơ sở đã tồn tại'
			});
			return;
		} else {
			const campus = await Campus.findByIdAndUpdate(req.params.id, req.body, { new: true });
			res.status(200).json({
				campus,
				success: true,
				message: 'Sửa cơ sở thành công'
			});
		}
	} catch (error) {
		res.json({
			error
		});
	}
};

export const removeCampus = async (req, res) => {
	try {
		const campus = await Campus.findByIdAndRemove(req.params.id);
		res.status(200).json({
			campus,
			success: false,
			message: 'Xóa cơ sở thành công'
		});
	} catch (error) {
		res.json({
			error
		});
	}
};
