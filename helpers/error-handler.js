const errorHandler = (err, req, res, next) => {
    if(err.name === "UnauthorizedError") {
        res.status(401).json({
            message:"The user is not authorized"
        })
    }

    if(err.name === "ValidatonError") {
        res.status(401).json({
            message:err
        })
    }

}


module.exports =  errorHandler;

