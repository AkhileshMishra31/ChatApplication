import Joi from 'joi';

// Friend Request validation function
export const validateFriendRequestInput = (value: any) => {
    const friendRequestSchema = Joi.object({
        receiverId: Joi.number().integer().required()
            .messages({
                'number.base': 'Receiver ID must be a valid number',
                'number.integer': 'Receiver ID must be an integer',
                'any.required': 'Receiver ID is required',
            }),
    }).messages({
        'any.required': '{{#label}} is required',
        'number.base': '{{#label}} should be a valid number',
        'number.integer': '{{#label}} should be an integer',
    });

    const validationResult = friendRequestSchema.validate(value, { abortEarly: false });

    return validationResult;
};
