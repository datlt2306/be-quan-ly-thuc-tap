import Joi from 'joi';
import { StudentSchoolingStatus } from '../constants/studentStatus';
export const validateDataImportStudent = (data) => {
	const newStudentSchema = Joi.array().items(
		Joi.object({
			mssv: Joi.string().trim().uppercase().required().messages({
				'string.base': 'Mã sinh viên phải là chuỗi',
				'any.required': 'Vui lòng nhập đầy đủ mã sinh viên'
			}),
			name: Joi.string().trim().required().messages({
				'string.base': 'Tên sinh viên phải là chuỗi',
				'any.required': 'Vui lòng nhập đầy đủ tên sinh viên'
			}),
			course: Joi.string().trim().required().messages({
				'string.base': 'Khóa nhập học phải là chuỗi',
				'any.required': 'Vui lòng nhập đầy đủ khóa nhập học của sinh viên'
			}),
			majorCode: Joi.string().trim().required().messages({
				'string.base': 'Mã ngành phải là chuỗi',
				'any.required': 'Vui lòng nhập đầy đủ mã ngành của sinh viên'
			}),
			email: Joi.string()
				.trim()
				.lowercase()
				.regex(/^[\w-\.]+@fpt\.edu\.vn$/)
				.required()
				.messages({
					'string.base': 'Email phải là chuỗi',
					'string.pattern.base': 'Email sinh viên không đúng định dạng',
					'any.required': 'Vui lòng nhập đầy đủ email của sinh viên'
				}),
			phoneNumber: Joi.string()
				.trim()
				.regex(/^\d{10,11}$/)
				.required()
				.messages({
					'string.base': 'Số điện thoại phải là chuỗi',
					'string.pattern.base': 'Số điện thoại của sinh viên chưa đúng định dạng',
					'any.required': 'Vui lòng nhập đầy đủ số điện thoại của sinh viên'
				}),
			statusStudent: Joi.string()
				.trim()
				.valid(...Object.keys(StudentSchoolingStatus))
				.required()
				.messages({
					'string.base': 'Trạng thái sinh viên phải là chuỗi',
					'any.only': 'Trạng thái sinh viên không hợp lệ',
					'any.required': 'Vui lòng nhập đầy đủ trạng thái sinh viên'
				}),
			smester_id: Joi.string().required().messages({
				'string.base': 'Kỳ học hiện tại phải là chuỗi',
				'any.required': 'Vui lòng nhập đầy đủ kỳ học hiện tại của sinh viên'
			}),
			campus_id: Joi.string().required(),
			note: Joi.string().optional()
		})
	);

	return newStudentSchema.validate(data);
};

export const validateDataCreateStudentList = (data) => {
	try {
		const schema = Joi.array().items(
			Joi.object({
				mssv: Joi.string().required(),
				statusStudent: Joi.string().required(),
				smester_id: Joi.string().required(),
				campus_id: Joi.string().required(),
				phoneNumber: Joi.string().required(),
				name: Joi.string().required(),
				course: Joi.number().required(),
				majorCode: Joi.string().required(),
				email: Joi.string()
					.email()
					.pattern(/^[\w-\.]+@fpt\.edu\.vn$/)
					.required()
			})
		);

		return schema.validate(data);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const validateUpdateStatus = (data) => {
	try {
		const schema = Joi.object({
			listIdStudent: Joi.array().items(Joi.string()).required(),
			status: Joi.number().required(),
			textNote: Joi.string().optional()
		});

		return schema.validate(data);
	} catch (error) {
		throw error;
	}
};
