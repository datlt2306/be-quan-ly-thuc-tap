import moment from 'moment';
import { sendMail } from './email.controller';
import { uploadFile } from '../services/googleDrive.service';
import studentModel from '../models/student.model';
import { generateEmail } from '../../utils/emailTemplate';
import { formSchema, reportSchema } from '../validation/reportForm.validation';
import createHttpError from 'http-errors';

export const report = async (req, res) => {
	let data, error, result, uploadedFile;

	const {
		attitudePoint,
		endInternShipTime,
		mssv,
		email,
		nameCompany,
		resultScore,
		_id,
		signTheContract,
	} = req.body;

	try {
		const filter = { mssv: mssv, email: email, _id };
		const findStudent = await studentModel.findOne(filter);

		if (!findStudent) throw createHttpError(403, 'Không tìm thấy thông tin sinh viên');

		if (!findStudent.internshipTime)
			throw createHttpError(403, 'Không tìm thấy thời gian thực tập');

		if (!endInternShipTime) throw createHttpError(403, 'Chưa nhập thời gian kết thúc thực tập');

		const startTimeReport = moment(findStudent.internshipTime).valueOf();
		const endTimeReport = moment(endInternShipTime).valueOf();
		const checkTimeReport = endTimeReport > startTimeReport;
		const [file] = req.files;

		if (!checkTimeReport)
			throw createHttpError(
				403,
				'Thời gian kết thúc thực tập phải lớn hơn thời gian bắt đầu!'
			);

		switch (findStudent.statusCheck) {
			// Đang thực tập
			case 6:
				uploadedFile = await uploadFile(file);

				data = {
					attitudePoint,
					endInternShipTime,
					nameCompany,
					resultScore,
					report: uploadedFile.url,
					statusCheck: 7,
					signTheContract,
				};

				error = reportSchema.validate(data).error;

				if (error) throw createHttpError(403, 'Sai dữ liệu: ' + error.message);

				result = await studentModel.findOneAndUpdate(filter, data, {
					new: true,
				});

				// await sendMail(generateEmail(findStudent.name, email, 'minutesRegistered'));
				return res.status(200).json({ message: 'Nộp báo cáo thành công', result });

			// Đã nộp báo cáo
			case 7:
				if (!findStudent.report)
					throw createHttpError(500, 'Không tìm thấy thông tin báo cáo');

				throw createHttpError(403, 'Thông tin báo cáo đã tồn tại và đang chờ xác nhận!');

			// Sửa báo cáo
			case 8:
				uploadedFile = await uploadFile(file);

				data = {
					attitudePoint,
					endInternShipTime,
					nameCompany,
					resultScore,
					report: uploadedFile.url,
					statusCheck: 7,
					signTheContract,
				};

				error = reportSchema.validate(data).error;

				if (error) throw createHttpError(403, 'Sai dữ liệu: ' + error.message);

				result = await studentModel.findOneAndUpdate(filter, data, {
					new: true,
				});
				// await sendMail(generateEmail(findStudent.name, email, 'minutesUpdated'));
				return res.status(200).json({ message: 'Sửa báo cáo thành công', result });
			default:
				throw createHttpError(403, 'Bạn không đủ điều kiện nộp báo cáo');
		}
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			message: error.message || 'Đã xảy ra lỗi! Vui lòng kiểm tra lại thông tin báo cáo!',
		});
	}
};

export const form = async (req, res) => {
	try {
		let data, result, uploadedFile, error;

		const { nameCompany, internshipTime, mssv, email, _id } = req.body;
		const filter = { mssv: mssv, email: email, _id };
		const [file] = req.files;
		const findStudent = await studentModel.findOne(filter);

		if (!findStudent)
			return res
				.status(404)
				.json({ status: false, message: 'Đã xảy ra lỗi! Vui lòng đăng ký lại!' });

		switch (findStudent.statusCheck) {
			// Chờ kiểm tra CV
			case 0:
				if (!findStudent.CV)
					return res.status(500).json({
						message: 'CV không tồn tại trên hệ thống',
					});

				return res.status(403).json({
					message: 'CV phải được duyệt trước khi nộp biên bản!',
				});

			// Nhận CV
			case 2:
				if (!findStudent.support == 1)
					return res.status(403).json({
						message: 'Bạn chưa gửi form nhờ nhà trường hỗ trợ',
					});

				uploadedFile = await uploadFile(file);

				data = {
					nameCompany,
					internshipTime,
					form: uploadedFile.url,
					statusCheck: 4,
				};

				error = formSchema.validate(data).error;

				if (error) return res.status(403).json('Sai dữ liệu: ' + error.message);

				result = await studentModel.findOneAndUpdate(filter, data, {
					new: true,
				});

				return res.status(200).json({ message: 'Nộp biên bản thành công', result });

			// Không đủ điều kiện
			case 3:
			case 10:
				return res.status(403).json({
					message: 'Bạn không đủ điều kiện nộp biên bản!',
				});

			// Đã nộp biên bản
			case 4:
				return res.status(403).json({
					message: 'Bạn đã nộp biên bản!',
				});

			// Sửa biên bản
			case 5:
				uploadedFile = await uploadFile(file);

				data = {
					nameCompany,
					internshipTime,
					form: uploadedFile.url,
					statusCheck: 4,
				};

				error = formSchema.validate(data).error;

				if (error) return res.status(403).json('Sai dữ liệu: ' + error.message);

				result = await studentModel.findOneAndUpdate(
					filter,
					{ ...data, note: null },
					{
						new: true,
					}
				);

				return res.status(200).json({ message: 'Sửa biên bản thành công', result });

			// Đã đăng ký
			case 11:
				if (!findStudent.support == 0)
					return res.status(403).json({
						message: 'Form tự tìm của bạn chưa được duyệt hoặc server bị lỗi!',
					});

				uploadedFile = await uploadFile(file);

				data = {
					nameCompany,
					internshipTime,
					form: uploadedFile.url,
					statusCheck: 4,
				};

				error = formSchema.validate(data).error;

				if (error) return res.status(403).json('Sai dữ liệu: ' + error.message);

				result = await studentModel.findOneAndUpdate(filter, data, {
					new: true,
				});

				return res.status(200).json({ message: 'Nộp biên bản thành công', result });

			default:
				throw new Error();
		}
	} catch (error) {
		console.error(error.message);
		return res.status(500).json({ message: 'Có lỗi xảy ra! Vui lòng quay lại sau ít phút' });
	}
};
