import { apiErrors } from "../utils/apiErrors.js";
import asyncHandlerByPromises from "../utils/asyncHandlerByPromises.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";


const verifYJWT = asyncHandlerByPromises(async (req, res, next) => {
    try {
        
        const token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ", "");

        if(!token) {
            throw new apiErrors(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if(!decodedToken) {
            throw new apiErrors(403, "Access denied");
        }

        const user = await User.findOne(decodedToken?._id);

        if(!user) {
            throw new apiErrors(404, "User token not found");
        }

        req.user = user;
        next();

    } catch (error) {
        throw new apiErrors(401, error?.message || "Invalid Access Token");
    }
});


export default verifYJWT;