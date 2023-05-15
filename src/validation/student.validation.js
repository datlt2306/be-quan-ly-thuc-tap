import Joi from 'joi';

export const validateDataCreateStudentList = (data) => {
	try {
		const schema = Joi.array().items(
			Joi.object({
				mssv: Joi.string().required('Mã sinh viên là trường bắt buộc'),
				name: Joi.string().required('Tên sinh viên là trường bắt buộc'),
				course: Joi.number().required('Khóa nhập học là trường bắt buộc'),
				majorCode: Joi.string().required('Mã ngành là trường bắt buộc'),
				email: Joi.string()
					.email('Email không hợp lệ')
					.pattern(/^[\w-\.]+@fpt\.edu\.vn$/, {
						message: 'Email sinh viên phải là mail FPT',
					})
					.required('Email là trường bắt buộc'),
			})
		);

		return schema.validate(data);
	} catch (error) {
		throw error;
	}
};

export const validateUpdateStatus = (data) => {
	try {
		const schema = Joi.object({
			listIdStudent: Joi.array().items(Joi.string()).required(),
			status: Joi.number().required(),
			textNote: Joi.string().optional(),
		});

		return schema.validate(data);
	} catch (error) {
		throw error;
	}
};
