const validator = require('validator')

const isEmpty = require('./isEmpty');


const validateCetgoriesInput = (data) => {
    let errors = {};
    data.name = !isEmpty(data.name) ? data.name : "";
    
    if(validator.isEmpty(data.name)){
        errors.name = "Name field is required"
    }
    
    return {errors, isValid:isEmpty(errors)};
}


module.exports = validateCetgoriesInput;