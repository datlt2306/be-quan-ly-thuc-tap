import moment from 'moment';
import createHttpError from 'http-errors';
import { getMailTemplate } from '../../utils/emailTemplate';
import studentModel from '../models/student.model';
import { uploadFile } from '../services/googleDrive.service';
import { formSchema, reportSchema } from '../validation/reportForm.validation';
import MailTypes from '../constants/mailTypes';
import { HttpException } from '../../utils/httpException';
import { sendMail } from '../services/mail.service';
import getFileExtension from '../../utils/toolkit';

export const report = async (req, res) => {
	let data, error, result, uploadedFile;

	const { attitudePoint, endInternShipTime, mssv, email, nameCompany, resultScore, _id, signTheContract } = req.body;

	try {
		const filter = { mssv, email, _id };
		const student = await studentModel.findOne(filter);

		if (!student) throw createHttpError(404, 'Không tìm thấy thông tin sinh viên');

		if (!student.internshipTime) throw createHttpError(400, 'Không tìm thấy thời gian thực tập');

		if (!endInternShipTime) throw createHttpError(400, 'Chưa nhập thời gian kết thúc thực tập');

		const startTimeReport = moment(student.internshipTime).valueOf();
		const endTimeReport = moment(endInternShipTime).valueOf();
		const checkTimeReport = endTimeReport > startTimeReport;
		const [file] = req.files;
		if (file.size > 1000000) throw createHttpError.PayloadTooLarge('Kích thước file quá lớn');
		if (getFileExtension(file) !== 'pdf')
			throw createHttpError.UnsupportedMediaType('File tải lên phải có định dạng PDF');
		if (!checkTimeReport) throw createHttpError(400, 'Thời gian kết thúc thực tập phải lớn hơn thời gian bắt đầu!');

		switch (student.statusCheck) {
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
					signTheContract
				};

				error = reportSchema.validate(data).error;

				if (error) throw createHttpError(400, 'Sai dữ liệu: ' + error.message);

				data.numberOfTime = 0;

				result = await studentModel.findOneAndUpdate(filter, data, {
					new: true
				});

				await sendMail({
					recipients: student.email,
					campusId: student.campus_id,
					...getMailTemplate(MailTypes.REPORT_REGISTRATION)
				});
				return res.status(200).json({ message: 'Nộp báo cáo thành công', result });

			// Đã nộp báo cáo
			case 7:
				if (!student.report) throw createHttpError(404, 'Không tìm thấy thông tin báo cáo');

				throw createHttpError(400, 'Thông tin báo cáo đã tồn tại và đang chờ xác nhận!');

			// Sửa báo cáo
			case 8:
				if (student.numberOfTime > 3) throw createHttpError(400, 'Tài khoạn của bạn đã vượt quá số lần đăng ký');
				uploadedFile = await uploadFile(file);

				data = {
					attitudePoint,
					endInternShipTime,
					nameCompany,
					resultScore,
					report: uploadedFile.url,
					statusCheck: 7,
					signTheContract
				};

				error = reportSchema.validate(data).error;

				if (error) throw createHttpError(400, 'Sai dữ liệu: ' + error.message);

				result = await studentModel.findOneAndUpdate(
					filter,
					{ ...data, numberOfTime: student.numberOfTime + 1, note: null },
					{
						new: true
					}
				);
				await sendMail({
					recipients: email,
					campusId: student.campus_id,
					...getMailTemplate(MailTypes.UPDATED_REPORT)
				});
				return res.status(200).json({ message: 'Sửa báo cáo thành công', result });
			default:
				throw createHttpError(400, 'Bạn không đủ điều kiện nộp báo cáo');
		}
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};

export const submitRecordForm = async (req, res) => {
	try {
		let data, result, uploadedFile, error;
		const { nameCompany, internshipTime, mssv, email, _id } = req.body;
		const filter = { mssv, email, _id };
		const [file] = req.files;
		if (file.size > 1000000) throw createHttpError.PayloadTooLarge('Kích thước file quá lớn');
		if (getFileExtension(file) !== 'pdf')
			throw createHttpError.UnsupportedMediaType('File tải lên phải có định dạng PDF');
		const student = await studentModel.findOne(filter);

		if (!student) throw createHttpError(404, 'Đã xảy ra lỗi! Vui lòng đăng ký lại!');

		switch (student.statusCheck) {
			// Chờ kiểm tra CV
			case 0:
				if (!student.CV) throw createHttpError(404, 'CV không tồn tại trên hệ thống');
				throw createHttpError(400, 'CV phải được duyệt trước khi nộp biên bản!');
			// Nhận CV
			case 2:
				// if (!findStudent.support == 1) throw createHttpError(400, 'Bạn chưa gửi form nhờ nhà trường hỗ trợ');
				uploadedFile = await uploadFile(file);
				data = {
					nameCompany,
					internshipTime,
					form: uploadedFile.url,
					statusCheck: 4
				};
				error = formSchema.validate(data).error;
				if (error) throw createHttpError(400, 'Sai dữ liệu: ' + error.message);
				result = await studentModel.findOneAndUpdate(filter, data, {
					new: true
				});

				await sendMail({
					recipients: student.email,
					campusId: student.campus_id,
					...getMailTemplate(MailTypes.RECORD_REGISTRATION)
				});

				return res.status(200).json({ message: 'Nộp biên bản thành công', result });
			// Không đủ điều kiện
			case 3:
				throw createHttpError(400, 'Bạn không đủ điều kiện nộp biên bản!');
			// Đã nộp biên bản
			case 4:
				throw createHttpError(400, 'Bạn đã nộp biên bản!');
			// Sửa biên bản
			case 5:
				if (student.numberOfTime > 3) throw createHttpError(400, 'Tài khoản của bạn đã vượt quá số lần đăng ký');
				uploadedFile = await uploadFile(file);
				data = {
					nameCompany,
					internshipTime,
					form: uploadedFile.url,
					statusCheck: 4
				};
				error = formSchema.validate(data).error;
				if (error) throw createHttpError(400, 'Sai dữ liệu: ' + error.message);
				result = await studentModel.findOneAndUpdate(
					filter,
					{ ...data, note: null, numberOfTime: student.numberOfTime + 1 },
					{
						new: true
					}
				);
				await sendMail({
					recipients: student.email,
					campusId: student.campus_id,
					...getMailTemplate(MailTypes.UPDATED_RECORD)
				});

				return res.status(200).json({ message: 'Sửa biên bản thành công', result });

			case 10:
				throw createHttpError(400, 'Bạn không đủ điều kiện nộp biên bản!');
			// Đã đăng ký
			case 11:
				if (!student.support == 0) {
					throw createHttpError(400, 'Form tự tìm của bạn chưa được duyệt hoặc server bị lỗi!');
				}
				uploadedFile = await uploadFile(file);
				data = {
					nameCompany,
					internshipTime,
					form: uploadedFile.url,
					statusCheck: 4
				};
				error = formSchema.validate(data).error;

				if (error) throw createHttpError(400, 'Sai dữ liệu: ' + error.message);
				data.numberOfTime = 0;
				result = await studentModel.findOneAndUpdate(filter, data, {
					new: true
				});

				await sendMail({
					recipients: student.email,
					campusId: student.campus_id,
					...getMailTemplate(MailTypes.RECORD_REGISTRATION)
				});
				return res.status(200).json({ message: 'Nộp biên bản thành công', result });

			default:
				throw new Error();
		}
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};
