import Joi from 'joi';

// Signup validation function
export const validateSignupInput = (value: any) => {

    const signupSchema = Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required()
            .messages({
                'string.base': 'Username should be a valid string',
                'string.empty': 'Username is required',
                'string.min': 'Username should have at least {#limit} characters',
                'string.max': 'Username should have at most {#limit} characters',
                'any.required': 'Username is required'
            }),
        email: Joi.string().email().required()
            .messages({
                'string.base': 'Email should be a valid string',
                'string.empty': 'Email is required',
                'string.email': 'Email must be a valid email address',
                'any.required': 'Email is required'
            }),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
            .messages({
                'string.base': 'Password should be a valid string',
                'string.empty': 'Password is required',
                'string.pattern.base': 'Password must be alphanumeric with 3-30 characters',
                'any.required': 'Password is required'
            }),
        confirm_password: Joi.string().valid(Joi.ref('password')).required()
            .messages({
                'any.only': 'Passwords must match',
                'string.empty': 'Repeat password is required'
            }),
        phone_number: Joi.string()
            .messages({
                'string.base': 'Phone number should be a valid string'
            }),
        country: Joi.string().required()
            .messages({
                'string.base': 'country should be a valid string'
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

    const validationResult = signupSchema.validate(value, { abortEarly: false });
    if (!validationResult.error) {
        delete validationResult.value.confirm_password;
    }

    return validationResult;
};

export const validateLoginInput = (value: any) => {

    const loginSchema = Joi.object({
        email: Joi.string().email().required()
            .messages({
                'string.base': 'Email should be a valid string',
                'string.empty': 'Email is required',
                'string.email': 'Email must be a valid email address',
                'any.required': 'Email is required'
            }),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
            .messages({
                'string.base': 'Password should be a valid string',
                'string.empty': 'Password is required',
                'string.pattern.base': 'Password must be alphanumeric with 3-30 characters',
                'any.required': 'Password is required'
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

    const validationResult = loginSchema.validate(value, { abortEarly: false });

    return validationResult;
};


export const validateToken = (value: any) => {
    const tokenSchema = Joi.object({
        token: Joi.string().required()
            .messages({
                'string.base': 'Token should be a valid string',
                'string.empty': 'Token is required',
                'any.required': 'Token is required'
            }),
    }).messages({
        'string.base': '{{#label}} should be a valid string',
        'string.empty': '{{#label}} is required',
        'string.email': 'Please provide a valid {{#label}}',
        'string.min': '{{#label}} should have at least {{#limit}} characters',
        'string.max': '{{#label}} should have at most {{#limit}} characters',
        'any.required': '{{#label}} is required',
    })

    return tokenSchema.validate(value, { abortEarly: false });
};


