'use strict';

module.exports = {
    NOT_AUTHORIZED: {
        message: 'Not authorized.',
        statusCode: 401
    },
    WRONG_PARAMETERS: {
        message: 'Wrong parameters.',
        statusCode: 400
    },
    CONFLICT: {
        message: 'The request could not be completed due to a conflict with the current state of the resource.',
        statusCode: 409
    },
    NOT_FOUND: {
        message: 'Resource not found.',
        statusCode: 404
    }
};
