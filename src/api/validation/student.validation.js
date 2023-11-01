import Joi from 'joi';
import { StudentSchoolingStatus } from '../constants/studentStatus';
export const validateDataImportStudent = (data) => {
	try {
		const newStudentSchema = Joi.array()
			.items(
				Joi.object().keys({
					mssv: Joi.string().trim().uppercase().required().messages({
						'string.empty': 'Vui lòng nhập đầy đủ mã sinh viên',
						'string.required': 'Vui lòng nhập đầy đủ mã sinh viên'
					}),
					name: Joi.string().trim().required().messages({
						'string.required': 'Vui lòng nhập đầy đủ tên sinh viên',
						'string.empty': 'Vui lòng nhập đầy đủ tên sinh viên'
					}),
					course: Joi.string().trim().required().messages({
						'string.required': 'Vui lòng nhập đầy đủ khóa nhập học của sinh viên',
						'string.empty': 'Vui lòng nhập đầy đủ khóa nhập học của sinh viên'
					}),
					majorCode: Joi.string().trim().required().messages({
						'string.required': 'Vui lòng nhập đầy đủ mã ngành của sinh viên',
						'string.empty': 'Vui lòng nhập đầy đủ mã ngành của sinh viên'
					}),
					email: Joi.string()
						.trim()
						.lowercase()
						.pattern(/^[\w-\.]+@fpt\.edu\.vn$/)
						.required()
						.messages({
							'string.empty': 'Vui lòng nhập đầy đủ email của sinh viên',
							'string.pattern.base': 'Email sinh viên không đúng định dạng',
							'string.required': 'Vui lòng nhập đầy đủ email của sinh viên'
						}),
					phoneNumber: Joi.string()
						.trim()
						.pattern(/^\d{10,11}$/)
						.required()
						.messages({
							'string.empty': 'Vui lòng nhập đầy đủ số điện thoại của sinh viên',
							'string.pattern.base': 'Số điện thoại của sinh viên chưa đúng định dạng',
							'string.required': 'Vui lòng nhập đầy đủ số điện thoại của sinh viên'
						}),
					statusStudent: Joi.string()
						.trim()
						.required()
						.valid(...Object.keys(StudentSchoolingStatus))
						.messages({
							'any.empty': 'Vui lòng nhập đầy đủ trạng thái sinh viên',
							'any.required': 'Vui lòng nhập đầy đủ trạng thái sinh viên',
							'any.only': 'Trạng thái sinh viên không hợp lệ'
						}),
					smester_id: Joi.string().required().messages({
						'string.required': 'Vui lòng nhập đầy đủ kỳ học hiện tại của sinh viên',
						'string.empty': 'Vui lòng nhập đầy đủ kỳ học hiện tại của sinh viên'
					}),
					campus_id: Joi.string().required(),
					note: Joi.string().optional()
				})
			)
			.unique('mssv', { ignoreUndefined: true })
			.message('Mã sinh viên không được trùng')
			.unique('email', { ignoreUndefined: true })
			.message('Email sinh viên không được trùng');

		return newStudentSchema.validate(data);
	} catch (error) {
		console.log(error);
		return { error: { message: error.message }, value: null };
	}
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
