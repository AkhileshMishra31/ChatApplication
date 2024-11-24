import Joi from 'joi';

// Signup validation function
export const validateOTPInput = (value: any) => {

    const otpSchema = Joi.object({
        email: Joi.string().email().required()
            .messages({
                'string.base': 'Email should be a valid string',
                'string.empty': 'Email is required',
                'string.email': 'Email must be a valid email address',
                'any.required': 'Email is required'
            }),
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


export const validateResendOTPInput = (value: any) => {

    const resendOTP = Joi.object({

        email: Joi.string().email().required()
            .messages({
                'string.base': 'Email should be a valid string',
                'string.empty': 'Email is required',
                'string.email': 'Email must be a valid email address',
                'any.required': 'Email is required'
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

    const validationResult = resendOTP.validate(value, { abortEarly: false });

    return validationResult;
};