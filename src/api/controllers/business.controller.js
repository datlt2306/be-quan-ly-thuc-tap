import BusinessModel from '../models/business.model';
import Student from '../models/student.model';
import { getCurrentSemester } from './semester.controller';
import createHttpError from 'http-errors';
import { businessListValidation, businessValidation } from '../validation/business.validation';

// [POST] /api/business
export const insertBusiness = async (req, res) => {
	const data = req.body;
	const campus = req.campusManager || req.campusStudent;
	try {
		if (!Array.isArray(data)) {
			throw createHttpError(400, 'Body data type không phải là array');
		}

		const { error } = businessListValidation.validate(data);

		if (error) throw createHttpError(400, { error: error.details[0].message });
		if (!data.length) throw createHttpError(204);

		// lấy ra kỳ học hiện tại
		const semester = await getCurrentSemester(campus);

		// check xem doanh nghiệp đã tồn tại trong db chưa
		const businessExists = [];
		const businessCodeList = data.map((item) => item.business_code);
		const businessExistDb = await BusinessModel.find({
			business_code: { $in: businessCodeList },
			campus_id: campus,
		}).select('name business_code');

		businessExistDb.forEach((item) => {
			let check = businessCodeList.includes(item.business_code);
			if (!check) return;
			businessExists.push({ name: item.name, business_code: item.business_code });
		});

		if (businessExists.length > 0) {
			throw createHttpError(409, 'Doanh nghiệp đã tồn tại (có thể ở kỳ trước)', {
				error: businessExists,
			});
		}

		// thêm kỳ học và cơ sở vào data
		const dataCreate = data.map((item) => ({
			...item,
			campus_id: campus,
			semester_id: semester._id,
		}));

		const result = await BusinessModel.insertMany(dataCreate);
		return res.status(201).json(result);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
			error: error.error,
		});
	}
};

// [GET] /api/business
export const listBusiness = async (req, res) => {
	const { page = 1, limit = 10, semester_id } = req.query;

	try {
		// lấy ra học kỳ hiện tại
		const campus = req.campusManager || req.campusStudent;
		let { _id: semester } = await getCurrentSemester(campus);
		if (semester_id) semester = semester_id;

		const result = await BusinessModel.paginate(
			{
				campus_id: campus,
				semester_id: semester,
			},
			{
				page: Number(page),
				limit: Number(limit),
				sort: { created_at: 'desc' },
				populate: ['major'],
				customLabels: {
					totalDocs: 'total',
					docs: 'list',
				},
			}
		);

		return res.status(200).json(result);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
		});
	}
};

// [DELETE] /api/business/:id
export const removeBusiness = async (req, res) => {
	const campus = req.campusManager || req.campusStudent;
	const id = req.params.id;
	try {
		// lấy ra học kỳ hiện tại
		const semester = await getCurrentSemester(campus);
		const business = await BusinessModel.findOne({
			_id: id,
			campus_id: campus,
			semester_id: semester._id,
		});

		if (!business) {
			throw createHttpError(404, 'Doanh nghiệp này không tồn tại!');
		}

		// kiểm tra có học sinh nào còn đăng ký doanh nghiệp không
		const isStudentOfBusiness = await Student.findOne({
			business: id,
			campus_id: business.campus_id,
			semester_id: business.semester_id,
		});

		if (isStudentOfBusiness) {
			throw createHttpError(403, 'Doanh nghiệp đang được sinh viên đăng ký không thể xóa.');
		}

		// Xóa
		const businessDelete = await BusinessModel.findByIdAndRemove(id);

		return res.status(200).json(businessDelete);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
		});
	}
};

// [POST] /api/business/new
export const createbusiness = async (req, res) => {
	const { business_code } = req.body;
	const data = req.body;
	const campus = req.campusManager || req.campusStudent;
	try {
		// lấy ra học kỳ hiện tại
		const semester = await getCurrentSemester(campus);
		const { error } = businessValidation.validate(data);
		// check xem đã tồn tại chưa
		const business = await BusinessModel.findOne({
			business_code: business_code,
			campus_id: campus,
		});

		if (business) throw createHttpError(409, 'Doanh nghiệp đã tồn tại');
		if (error) throw createHttpError(400, { error: error.details[0].message });

		const newBusiness = await new BusinessModel({
			...data,
			campus_id: campus,
			semester_id: semester._id,
		}).save();

		return res.status(201).json(newBusiness);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
		});
	}
};

// [PATCH] /api/business/:id
export const updateBusiness = async (req, res) => {
	const data = req.body;
	const id = req.params.id;
	const campus = req.campusManager || req.campusStudent;
	try {
		const semester = await getCurrentSemester(campus);
		const { error } = businessValidation.validate(data);

		if (error) throw createHttpError(400, { error: error.details[0].message });

		const business = await BusinessModel.findOne({
			_id: id,
			semester_id: semester._id,
			campus_id: campus,
		});

		if (!business) {
			throw createHttpError(404, 'Doanh nghiệp không tồn tại');
		}

		const itemBusinessUpdate = await BusinessModel.findByIdAndUpdate(id, data, {
			new: true,
		});

		return res.status(201).json(itemBusinessUpdate);
	} catch (error) {
		if (error.code === 11000) {
			return res.status(409).json({
				statusCode: 409,
				message: 'Mã doanh nghiệp đã tồn tại',
			});
		}
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
		});
	}
};

// [GET] /api/business/:id
export const getBusiness = async (req, res) => {
	try {
		const id = req.params.id;
		const result = await BusinessModel.findOne({
			_id: id,
		});

		if (!result) {
			throw createHttpError(404, 'Doanh nghiệp cần tìm không tồn tại');
		}

		return res.status(200).json(result);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
		});
	}
};

// [PATCH] /api/business (Tái sử dụng lại dữ liệu doanh nghiệp từ kỳ cũ)
export const updateMany = async (req, res) => {
	try {
		const data = req.body;
		const campus = req.campusManager || req.campusStudent;

		if (!Array.isArray(data)) {
			throw createHttpError(400, 'Data body gửi lên không phải type array');
		}

		if (data.length === 0) {
			throw createHttpError(204);
		}

		const semester = await getCurrentSemester(campus);

		await BusinessModel.updateMany(
			{ _id: { $in: data } },
			{
				$set: {
					semester_id: semester._id,
					status: 1,
				},
			},
			{ multi: true }
		);

		return res.status(201).json({
			message: `Đã chuyển doanh nghiệp sang kỳ học ${semester.name}!`,
		});
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
		});
	}
};