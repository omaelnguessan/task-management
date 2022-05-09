import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.string().default(3000),
  STAGE: Joi.string().required(),
  DB_TYPE: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_NAME: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
});