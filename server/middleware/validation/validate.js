const { NotAllowedError } = require("../../core/helpers/response");

const validate = (schema, types) => (req, res, next) => {
    const options = {
        aboutEarly: false, //? Include All Errors
        allowUnknown: true, //? Do Not Ignore Unknown Props
        stripUnknown: true, //? Remove Unknown Props
    };

    let ObjectToValidate = {};

    for (let type of types) {
        if (type === "body") {
            ObjectToValidate = req?.body;
        } else if (type === "params") {
            ObjectToValidate = { ...ObjectToValidate, ...req?.params };
        } else if (type === "query") {
            ObjectToValidate = { ...ObjectToValidate, ...req?.query };
        }
    }

    const { error, value } = schema.validate(ObjectToValidate, options);

    if (error) {
        throw new NotAllowedError(error.message);
    }

    req.body = value;
    req.query = null;
    req.params = null;
    next();
};

module.exports = validate;
