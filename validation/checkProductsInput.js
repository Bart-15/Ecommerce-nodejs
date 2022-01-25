const validator = require('validator')

const isEmpty = require('./isEmpty');

const checksProductsInput = (data) => {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : "";
    data.description = !isEmpty(data.description) ? data.description : "";
    data.countInStock = !isEmpty(data.countInStock) ? data.countInStock: "";

    if(validator.isEmpty(data.name)) {
        errors.name = "Name field is required";
    }

    if(validator.isEmpty(data.description)) {
        errors.description = "Description field is required";
    }

    if(validator.isEmpty(data.countInStock)){
        errors.countInStock = "CountInStock field is required";
    }

    return {errors, isValid:isEmpty(errors)}
}

module.exports = checksProductsInput;