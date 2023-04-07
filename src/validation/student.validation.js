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
