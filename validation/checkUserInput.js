const validator = require('validator');
const isEmpty = require('./isEmpty')


const validateUserInput = (data) => {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.phone = !isEmpty(data.phone) ? data.phone : "";

    if(validator.isEmpty(data.name)) {
        errors.name = "Name field is required";
    }

    if(validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    }


    if(validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }

    if(validator.isEmpty(data.phone)) {
        errors.phone = "Phone field is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }

}


module.exports = validateUserInput;