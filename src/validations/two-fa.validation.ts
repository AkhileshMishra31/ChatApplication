import Joi from "joi";

export const validate2faInput = (value: any) => {

    const otpSchema = Joi.object({
        otp: Joi.string().alphanum().min(3).max(30).required()
            .messages({
                'string.base': 'otp should be a valid string',
                'string.empty': 'otp is required',
                'any.required': 'otp is required'
            }),
    }).messages({
        'string.base': '{{#label}} should be a valid string',
        'string.empty': '{{#label}} is required',
        'string.email': 'Please provide a valid {{#label}}',
        'string.min': '{{#label}} should have at least {{#limit}} characters',
        'string.max': '{{#label}} should have at most {{#limit}} characters',
        'any.required': '{{#label}} is required',
        'string.allow': '{{#label}} should be a valid string',
        'string.optional': '{{#label}} should be optional'
    });

    const validationResult = otpSchema.validate(value, { abortEarly: false });

    return validationResult;
};