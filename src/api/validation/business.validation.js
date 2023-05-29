import Joi from 'joi';

const schema = Joi.object({
	name: Joi.string().required(),
	internship_position: Joi.string().required(),
	major: Joi.string().required(),
	amount: Joi.number().default(0),
	address: Joi.string().required(),
	semester_id: Joi.string().required(),
	campus_id: Joi.string().required(),
	tax_code: Joi.string().required(),
	business_code: Joi.string().required(),
	requirement: Joi.string(),
	description: Joi.string(),
	benefit: Joi.string(),
	status: Joi.number().default(1),
	created_at: Joi.date().default(Date.now)
});

export const businessValidation = (value) => schema.validate(value);

export const businessListValidation = (values = [], _ = Joi.array().items(schema)) => _.validate(values);
