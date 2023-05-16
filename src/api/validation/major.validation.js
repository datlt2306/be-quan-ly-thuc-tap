import Joi from 'joi';

export const validateDataMajor = (data) => {
	const schema = Joi.object({
		name: Joi.string().required(),
		majorCode: Joi.string().required(),
	});

	return schema.validate(data);
};

export const validateDataArrayMajor = (data) => {
	const schema = Joi.array().items(
		Joi.object({
			name: Joi.string().required(),
			majorCode: Joi.string().required(),
		})
	);

	return schema.validate(data);
};

export const validateDataUpdateMajor = (data) => {
	const schema = Joi.object({
		name: Joi.string().required().optional(),
		majorCode: Joi.string().required().optional(),
	});

	return schema.validate(data);
};
