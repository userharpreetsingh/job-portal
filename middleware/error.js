class ErrorHandler extends Error {
    constructor(message,statusCode){
        super(message);
        this.statusCode=statusCode
    }
}

export const errorMiddleware=(err,req,res,next)=>{
    err.message || "internal server error";
    err.statusCode || 500;
     
    if(err.name === "CasteError"){
        const message=`resource not found${err.path}`
    }
    if(err.name === "11000"){
        const message=`duplicate object${Object.keys(err.KeyValue)}`
    }
    if(err.name === "JsonWebTokenError"){
        const message=`json eb token invalid, try again`
    }
    if(err.name === "TokenExpiredError"){
        const message=`json eb token expired, try again`
    }
    return res.status(statusCode).json({
        success:false,
        message:err.message
    })
}

export default ErrorHandler;