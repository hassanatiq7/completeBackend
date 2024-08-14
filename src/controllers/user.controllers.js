import asyncHandlerByPromises from "../utils/asyncHandlerByPromises.js";
import User from "../models/user.model.js";
import { apiErrors } from "../utils/apiErrors.js";
import { apiResponse } from "../utils/apiResponse.js";
import { v2 as cloudinary } from "cloudinary";
import { fileUploaderOnCLoud } from "../service/cloudinary.js";

export const changePassword = asyncHandlerByPromises(async (req, res) => {
    //Update user password in the database
    //Send a success response to the user
    const userId = req.user?._id;

    const { oldPassword, newPassword, confirmPassword } = req.body;

    if([oldPassword, newPassword, confirmPassword].some(fields => fields?.trim() ==="" )){
        throw new apiErrors(401, "All fields are required")
    }
    
    if(newPassword !==confirmPassword){
        throw new apiErrors(401, "Passwords do not match")
    }

    const user = await User.findById(userId);

    if(!user) {
        throw new apiErrors(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(oldPassword);

    if(!isPasswordValid) {
        throw new apiErrors(401, "Invalid password");
    }
    
    user.password = newPassword;
    await user.save({ validateBeforeSave: false});

    return res.status(200)
    .json(new apiResponse(200, "Password updated successfully"));

});


export const getCurrentUser = asyncHandlerByPromises(async ( req, res ) => {
    const user = req.user?._id;

    const currentUser = await User.findById(user);

    if(!currentUser) {
        throw new apiErrors(404, "User not found");
    }

    return res.status(200)
   .json(new apiResponse(200, "User retrieved successfully", currentUser));

});

export const updateFullName = asyncHandlerByPromises(async ( req, res) => {
    const userId = req.user?._id;
    const { fullName } = req.body;

    if(!fullName) {
        throw new apiErrors(400, "Full name is required");
    }

    const updatedUser = await User.findByIdAndUpdate(userId,
        {
            $set:{
                fullName: fullName,
            },
        },
        {new: true}
    ).select("-password -refreshtoken");

    return res.status(200)
   .json(new apiResponse(200, "Full name updated successfully", updatedUser));

});


export const updateAvatar = asyncHandlerByPromises( async ( req, res ) => {
    const userId = req.user?._id;
    const user = await User.findById(userId);

    if(user.avatar){
        const image = user.avatar.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(image);
    }
    
    const avatarLocalPath = req.file?.path;
    
    if(!avatarLocalPath) {
        throw new apiErrors(400, "Avatar is required");
    }

    const avatar = await fileUploaderOnCLoud(avatarLocalPath);

    if(!avatar) {
        throw new apiErrors(400, "Error uploading avatar to cloudinary");
    }

    const updatedUser = await User.findByIdAndUpdate(userId,
        {
            $set:{
                avatar: avatar.url,
            }
        },{
            new: true
        }).select("-password -refreshtoken");

        return res.status(200)
        .json(new apiResponse(200, "Avatar updated successfully", updatedUser));

});

