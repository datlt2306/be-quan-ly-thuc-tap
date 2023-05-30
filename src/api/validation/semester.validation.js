import Joi from 'joi';

const schema = Joi.object({
	name: Joi.string().trim().lowercase().required(),
	campus_id: Joi.string().required(),
	start_time: Joi.date().required(),
	end_time: Joi.date().greater(Joi.ref('start_time')).required()
});

export const semesterValidation = (data) => schema.validate(data);
