import User from "../models/user.model.js";
import { apiErrors } from "../utils/apiErrors.js";


const generateAuthTokens = async (userId) => {

try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
    
        user.refreshtoken = refreshToken;
        await user.save({ validateBeforeSave: false});
        return {accessToken, refreshToken};
} catch (error) {
    res
    .status(500)
    .json( apiErrors(500, "something went wrong while generating a refresh token and access token"))
}
}

export default generateAuthTokens;