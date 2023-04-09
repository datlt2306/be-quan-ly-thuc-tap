import Joi from 'joi';

export const validateConfigTimeCreateData = (data) => {
	try {
		const schema = Joi.object({
			typeName: Joi.string().required(),
			startTime: Joi.number().required(),
			endTime: Joi.number().required(),
		});

		return schema.validate(data);
	} catch (error) {
		throw error;
	}
};

export const validateConfigTimeUpdateData = (data) => {
	try {
		const schema = Joi.object({
			typeName: Joi.string().required().optional(),
			startTime: Joi.number().required().optional(),
			endTime: Joi.number().required().optional(),
		});

		return schema.validate(data);
	} catch (error) {
		throw error;
	}
};
