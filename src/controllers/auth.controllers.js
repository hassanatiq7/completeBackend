import asyncHandlerByPromises from "../utils/asyncHandlerByPromises.js";

export const registerUser = asyncHandlerByPromises( async (req,res) =>{
    res.status(200).json({
        message:"Ok",

    });
});
