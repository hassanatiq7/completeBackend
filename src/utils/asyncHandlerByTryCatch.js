// High Order Function Syntax
// variableDeclarationType functionName = (function as Parameter) = ( functionParametera that we take as parameter) =>{}


const asyncHandlerByTryCatch = (requestHandler) = async(req, res, next) => {
    try {
        await requestHandler(req, res, next);
    } catch (error) {
        res.status(error.status || 500).json({
            message: error.message,
            sucess: false,
        })
    }
}

export default asyncHandlerByTryCatch;