class AppError extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 ? "fail" : "success";
        Error.captureStackTrace(this,this.constructor);
        //This line improves debugging by removing unnecessary stack trace noise and pointing directly to where the error actually occurred.
    }
}

module.exports =  AppError;