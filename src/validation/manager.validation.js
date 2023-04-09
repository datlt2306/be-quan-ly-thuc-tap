import Joi from 'joi';

export const validateManagerDataCreate = (data) => {
	try {
		const schema = Joi.object({
			name: Joi.string().required(),
			email: Joi.string().email().required(),
			role: Joi.number().required(),
		});

		return schema.validate(data);
	} catch (error) {
		throw error;
	}
};

export const validateManagerDataUpdate = (data) => {
	try {
		const schema = Joi.object({
			name: Joi.string().required().optional(),
			email: Joi.string().email().required().optional(),
			role: Joi.number().required().optional(),
		});

		return schema.validate(data);
	} catch (error) {
		throw error;
	}
};
