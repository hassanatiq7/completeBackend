import asyncHandlerByPromises from "../utils/asyncHandlerByPromises.js";
import User from "../models/user.model.js";
import { apiErrors } from "../utils/apiErrors.js";
import { fileUploaderOnCLoud } from "../service/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

export const registerUser = asyncHandlerByPromises(async (req, res) => {
    //Take user data
    //start validating user data
    //check user data if available or not
    //check username exists in database
    //check email exists in database
    //Hash the password
    //save user data in database
    //generate access token
    //send access token to user

    const { fullName, userName, email, password } = req.body;

    if (
        [ fullName, userName, email, password ].some(
            (fields) => fields?.trim() === "",
        )
    ) {
        throw new apiErrors(400, "All fields must be filled in");
    }

    console.log(`${fullName}, ${userName}, ${email}, ${password}`); 

    const userExists = await User.findOne({
        $or: [{ userName }, { email }]
    });

    if( userExists ) {
        throw new apiErrors(409, "User already exists");
    }

    console.log(req.files);
    
    // (ONLY IF WHEN COVER IMAGE AND AVATAR IS REQUIRED)
    // const avatarLocalPath = req.files?.avatar[0].path
    // const coverImageLocalPath = req.files?.coverImage[0].path 

    let avatarLocalPath;
    let coverImageLocalPath;

    if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        avatarLocalPath = req.files.avatar[0].path;
    }

    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    // console.log(`Avatar: ${avatarLocalPath}`);
    // console.log(`Cover: ${coverImageLocalPath}`);
    
    // if( !avatarLocalPath ){
    //     throw new apiErrors(400, "Avatar is required");
    // }

    // if( !coverImageLocalPath ){
    //     throw new apiErrors(400, "Cover Image is required");
    // }

    const avatar = await fileUploaderOnCLoud(avatarLocalPath); 
    const coverImage = await fileUploaderOnCLoud(coverImageLocalPath); 

    // if( !avatar ){
    //     throw new apiErrors(400, "Avatar file is required");
    // }

    // if( !coverImage ){
    //     throw new apiErrors(400, "Cover Image is required");
    // }

    const newUser = await User.create(
        {
            fullName,
            userName: userName.toLowerCase(),
            email,
            password,
            avatar: avatar?.url || "",
            coverImage: coverImage?.url || "",
        }
    )

    const newUserCreated = await User.findOne(newUser).select("-password -refreshToken");

    if( !newUserCreated ) {
        throw new apiErrors(500, "Failed to create user");
    }


    res.status(201).json(
       new apiResponse(201, newUserCreated,"User registered successfully")
    );
});
