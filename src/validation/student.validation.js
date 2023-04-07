import Joi from 'joi';

export const validateDataCreateStudentList = (data) => {
	try {
		const schema = Joi.array().items(
			Joi.object({
				mssv: Joi.string().required(),
				name: Joi.string().required(),
				course: Joi.number().required(),
				majors: Joi.string().required(),
				email: Joi.string().required(),
			})
		);

		return schema.validate(data);
	} catch (error) {
		throw error;
	}
};
