class AppError extends Error{
    constructor(message , statusCodes){
        super(message);
        this.statusCodes=statusCodes;
        this.explaination=message;
    }
}
module.exports=AppError;