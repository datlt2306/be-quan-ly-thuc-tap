import BusinessModel from '../models/business.model';
import Student from '../models/student.model';
import { getDefaultSemester, getCurrentSemester } from '../services/semester.service';
import createHttpError from 'http-errors';
import { businessListValidation, businessValidation } from '../validation/business.validation';
import { upsertBusinessList } from '../services/business.service';
import { HttpException } from '../../utils/httpException';
import { isValidObjectId } from 'mongoose';

//* New Route
// [PUT] /api/business
export const insertBusinessList = async (req, res) => {
	const {
		body,
		campusManager: campus_id,
		query: { semester_id: customSemester }
	} = req;

	try {
		const { _id: semester_id } = await getCurrentSemester(campus_id);

		if (!body.length) throw createHttpError(400, 'Dữ liệu phải là một mảng array');
		if (!campus_id) throw createHttpError(404, 'Không tìm thấy cơ sở hiện tại');
		if (!semester_id && !customSemester) throw createHttpError(404, 'Không tìm thấy kỳ học hiện tại');

		const [statusCode, message] = await upsertBusinessList(body, customSemester || semester_id, campus_id);

		return res.status(statusCode).json({ statusCode, message });
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};

//! DEPRECATE
// [POST] /api/business
export const insertBusiness = async (req, res) => {
	const data = req.body;
	const campus = req.campusManager || req.campusStudent;
	try {
		if (!data.length) throw createHttpError(400, 'Body data type không phải là array');

		const { error } = businessListValidation(data);

		if (error) throw createHttpError(400, 'Dữ liệu không hợp lệ!');

		// lấy ra kỳ học hiện tại
		const semester = await getCurrentSemester(campus);

		// check xem doanh nghiệp đã tồn tại trong db chưa
		const businessExists = [];
		const businessCodeList = data.map((item) => item.business_code);
		const businessExistDb = await BusinessModel.find({
			business_code: { $in: businessCodeList },
			campus_id: campus
		}).select('name business_code');

		businessExistDb.forEach((item) => {
			let check = businessCodeList.includes(item.business_code);
			if (!check) return;
			businessExists.push({ name: item.name, business_code: item.business_code });
		});

		if (businessExists.length > 0) {
			throw createHttpError(409, 'Doanh nghiệp đã tồn tại (có thể ở kỳ trước)', {
				error: businessExists
			});
		}

		// thêm kỳ học và cơ sở vào data
		const dataCreate = data.map((item) => ({
			...item,
			campus_id: campus,
			semester_id: semester._id
		}));

		const result = await BusinessModel.insertMany(dataCreate);

		return res.status(201).json(result);
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};

//* Role Student & Manager
// [GET] /api/business
export const listBusiness = async (req, res) => {
	const { page = 1, limit = 30, semester_id: customSemesterID, ...optionalQuery } = req.query;

	const campus_id = req.campusManager || req.campusStudent;
	const semester_id = customSemesterID || (await getDefaultSemester(campus_id));

	try {
		// lấy ra học kỳ hiện tại
		if (!campus_id) throw createHttpError(400, 'Không tìm thấy cơ sở');
		if (!semester_id) throw createHttpError(400, 'Không tìm thấy kỳ học');

		let options = {
			page: Number(page),
			limit: Number(limit),
			sort: { created_at: 'desc' },
			populate: ['major'],
			customLabels: {
				totalDocs: 'total',
				docs: 'list'
			}
		};

		let filters = {
			campus_id,
			semester_id,
			optionalQuery
		};

		if (optionalQuery) filters = { ...filters, ...optionalQuery };

		const result = await BusinessModel.paginate(filters, options);

		return res.status(200).json(result);
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};

// [DELETE] /api/business/:id
export const removeBusiness = async (req, res) => {
	try {
		const id = req.params.id;

		if (!isValidObjectId(id)) throw createHttpError(400, 'ID không hợp lệ');

		const hasStudentApplied = await Student.findOne({ business: id }); // Kiểm tra có học sinh nào còn đăng ký doanh nghiệp không

		if (hasStudentApplied) throw createHttpError(400, 'Doanh nghiệp đang được sinh viên đăng ký không thể xóa.');

		const deletedBusiness = await BusinessModel.findByIdAndRemove(id);

		if (!deletedBusiness) throw createHttpError(404, 'Doanh nghiệp này không tồn tại!');

		return res.status(200).json(deletedBusiness);
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};

//! DEPRECATE
// [POST] /api/business/new
export const createbusiness = async (req, res) => {
	const { business_code } = req.body;
	const data = req.body;
	const campus = req.campusManager || req.campusStudent;
	try {
		// lấy ra học kỳ hiện tại
		const semester = await getCurrentSemester(campus);
		const { error } = businessValidation(data);
		// check xem đã tồn tại chưa
		const business = await BusinessModel.findOne({
			business_code: business_code,
			campus_id: campus
		});

		if (business) throw createHttpError(409, 'Doanh nghiệp đã tồn tại');
		if (error) throw createHttpError(400, { error: error.details[0].message });

		const newBusiness = await new BusinessModel({
			...data,
			campus_id: campus,
			semester_id: semester._id
		}).save();

		return res.status(201).json(newBusiness);
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};

// [PATCH] /api/business/:id
export const updateBusiness = async (req, res) => {
	let data = req.body;
	const id = req.params.id;
	const campus_id = req.campusManager;

	try {
		const { _id: semester_id } = await getCurrentSemester(campus_id);

		if (!campus_id) throw createHttpError(404, 'Không tìm thấy cơ sở hiện tại');
		if (!semester_id && !customSemester) throw createHttpError(404, 'Không tìm thấy kỳ học hiện tại');
		if (!isValidObjectId(id)) throw createHttpError(400, 'ID không hợp lệ');

		data = { ...data, semester_id: semester_id.toString(), campus_id: campus_id.toString() };

		const { error } = businessValidation(data);

		if (error) throw createHttpError(400, 'Dữ liệu không hợp lệ');

		const business = await BusinessModel.findOne({
			_id: id,
			semester_id,
			campus_id
		});

		if (!business) throw createHttpError(404, 'Doanh nghiệp không tồn tại');

		const itemBusinessUpdate = await BusinessModel.findByIdAndUpdate(id, data, { new: true });

		return res.status(201).json(itemBusinessUpdate);
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};

// [GET] /api/business/:id
export const getBusiness = async (req, res) => {
	try {
		const id = req.params.id;

		if (!isValidObjectId(id)) throw createHttpError(400, 'ID không hợp lệ');

		const result = await BusinessModel.findById(id);

		if (!result) throw createHttpError(404, 'Doanh nghiệp cần tìm không tồn tại');

		return res.status(200).json(result);
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};

//! DEPRECATE
// [PATCH] /api/business (Tái sử dụng lại dữ liệu doanh nghiệp từ kỳ cũ)
export const updateMany = async (req, res) => {
	try {
		const data = req.body;
		const campus = req.campusManager || req.campusStudent;

		if (!Array.isArray(data)) throw createHttpError(400, 'Data body gửi lên không phải type array');

		if (!data.length) throw createHttpError(400, 'Sai dữ liệu');

		const semester = await getCurrentSemester(campus);

		await BusinessModel.updateMany(
			{ _id: { $in: data } },
			{
				$set: {
					semester_id: semester._id,
					status: 1
				}
			},
			{ multi: true }
		);

		return res.status(201).json({
			message: `Đã chuyển doanh nghiệp sang kỳ học ${semester.name}!`
		});
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};
