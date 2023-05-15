const Joi = require('joi');

export const businessValidation = Joi.object({
	name: Joi.string().required(),
	internship_position: Joi.string().required(),
	major: Joi.string().required(),
	amount: Joi.number().default(0),
	address: Joi.string(),
	semester_id: Joi.string(),
	campus_id: Joi.string(),
	tax_code: Joi.string().required(),
	business_code: Joi.string().required(),
	requirement: Joi.string(),
	description: Joi.string(),
	benefit: Joi.string(),
	status: Joi.number().default(1),
	created_at: Joi.date().default(Date.now),
});

export const businessListValidation = Joi.array().items(businessValidation);
