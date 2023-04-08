import Joi from 'joi';

export const validateDataCreateStudentList = (data) => {
	try {
		const schema = Joi.array().items(
			Joi.object({
				mssv: Joi.string().required(),
				name: Joi.string().required(),
				course: Joi.number().required(),
				majorCode: Joi.string().required(),
				email: Joi.string().email().required(),
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
