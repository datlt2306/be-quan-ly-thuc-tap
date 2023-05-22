import Joi from 'joi';

export const reportSchema = Joi.object({
	nameCompany: Joi.string().required(),
	internshipTime: Joi.string().required(),
	form: Joi.string().uri().required(),    
	statusCheck: Joi.number().required(),
});
