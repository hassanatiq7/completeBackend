import asyncHandlerByPromises from "../utils/asyncHandlerByPromises.js";
import User from "../models/user.model.js";
import { fileUploaderOnCLoud } from "../service/cloudinary.js";
import { apiErrors } from "../utils/apiErrors.js";
import { apiResponse } from "../utils/apiResponse.js";
import generateAuthTokens from "../middlewares/generateAuthToken.js";

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
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


    const { fullName, userName, email, password } = req.body;

    if (
        [ fullName, userName, email, password ].some(
            (fields) => fields?.trim() === "",
        )
    ) {
        throw new apiErrors(400, "All fields must be filled in");
    }

    if(!emailRegex.test(email)) {
        throw new apiErrors(400, "Invalid email format");
    }
    // console.log(`${fullName}, ${userName}, ${email}, ${password}`); 

    const userExists = await User.findOne({
        $or: [{ userName }, { email }]
    });

    if( userExists ) {
        throw new apiErrors(409, "User already exists");
    }

    // console.log(req.files);
    
    // (ONLY IF WHEN COVER IMAGE AND AVATAR IS REQUIRED)
    // const avatarLocalPath = req.files?.avatar[0].path
    // const coverImageLocalPath = req.files?.coverImage[0].path 

    let avatarLocalPath;
    let coverImageLocalPath;

    if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        avatarLocalPath = req.files.avatar[0].path;
        // console.log(`Avatar local path: ${avatarLocalPath}`);
    }

    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
        // console.log(`Cover local path: ${coverImageLocalPath}`);
    }


    // if( !avatarLocalPath ){
    //     throw new apiErrors(400, "Avatar is required");
    // }

    // if( !coverImageLocalPath ){
    //     throw new apiErrors(400, "Cover Image is required");
    // }

    const avatar = await fileUploaderOnCLoud(avatarLocalPath); 
    const coverImage = await fileUploaderOnCLoud(coverImageLocalPath); 


    // console.log(`Avatar: ${avatar}`);
    // console.log(`Cover: ${coverImage}`);

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
            coverImage: coverImage?.url ||"",
        }
    );

    const { accessToken, refreshToken } = await generateAuthTokens(newUser._id)

    const options = {
        httpOnly: true,
        secure: true,
    };
    
    

    const newUserCreated = await User.findById(newUser._id).select("-password -refreshtoken");

    if( !newUserCreated ) {
        throw new apiErrors(500, "Failed to create user");
    }


    res.status(201)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
       new apiResponse(201, newUserCreated,"User registered successfully")
    );
});

export const loginUser = asyncHandlerByPromises(async (req, res) => {
    //Take user data
    //start validating user data
    //check user data if available or not
    //check password is correct
    //generate access token
    //generate refresh token
    //send access token and refresh token to user

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


    const { userName, email, password } = req.body;
    
    if (
        [ userName, email, password ].some(
            (fields) => fields?.trim() === "",
        )){
            throw new apiErrors(400, "All fields must be filled in");
        }

        console.log(`${userName}  ${password}  ${email}`)

       if(!emailRegex.test(email)) {
        throw new apiErrors(400, "Invalid email format");
       }

       const user = await User.findOne({
            $or: [{ userName }, { email }]
       });

       if(!user) {
        throw new apiErrors(404, "User not found");
       }
    //    console.log(user);

       const isPasswordValid = await user.isPasswordCorrect(password);

       if(!isPasswordValid) {
        throw new apiErrors(401, "Invalid password");
       }

       const { accessToken, refreshToken } = await generateAuthTokens(user._id)
       const options = {
        httpOnly: true,
        secure: true,
       };
       
       const userLoggedIn = await User.findById(user._id).select("-password -refreshtoken");
       res.status(200)
       .cookie("refreshToken", refreshToken, options)
       .cookie("accessToken", accessToken, options)
       .json(
           new apiResponse(200, userLoggedIn,"User logged in successfully")
       );
});


export const logout = asyncHandlerByPromises(async (req, res) => {
    //Remove access token and refresh token from user's cookies
    //send a success response to user

    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshtoken: undefined,
        },
    },
    {new: true}
);

 const options = {
    httpOnly: true,
    secure: true,
 };

    res.status(200)
   .clearCookie("refreshToken", options)
   .clearCookie("accessToken", options)
   .json(
       new apiResponse(200, {},"User logged out successfully")
    );

});