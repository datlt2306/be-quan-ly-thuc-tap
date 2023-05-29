import Joi from 'joi';

const schema = Joi.object({
   const requestSchema = Joi.object({
      user_id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
      description: Joi.string().required(),
      type: Joi.string().required(),
      status: Joi.number().integer().default(1),
      createAt: Joi.date().default(Date.now)
    });
})

export const studentRequestValidation = (data) => {};
