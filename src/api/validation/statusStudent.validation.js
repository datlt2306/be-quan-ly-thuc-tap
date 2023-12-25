import Joi from 'joi';

export const statusStudentValidate = (data) => {
	try {
		const schema = Joi.object({
			value: Joi.number().required(),
			title: Joi.string().required(),
			contentMail: Joi.string().required(),
			titleMail: Joi.string().required()
		});

		return schema.validate(data);
	} catch (error) {
		throw error;
	}
};

export const statusUpdateValidate = (data) => {
	try {
		const schema = Joi.object({
			value: Joi.number().required().optional(),
			title: Joi.string().required().optional(),
			contentMail: Joi.string().required().optional(),
			titleMail: Joi.string().required().optional()
		});

		return schema.validate(data);
	} catch (error) {
		throw error;
	}
};
