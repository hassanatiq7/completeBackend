import asyncHandlerByPromises from "../utils/asyncHandlerByPromises.js";
import User from "../models/user.model.js";
import { apiErrors } from "../utils/apiErrors.js";
import { fileUploaderOnCLoud } from "../service/cloudinary.js";

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
        console.log(`${fullName}, ${userName}, ${email}, ${password}`);
        throw new apiErrors(400, "All fields must be filled in");
    }

    const userExists = await User.findOne({
        $or: [{ userName }, { email }],
    });

    if( userExists ) {
        throw new apiErrors(409, "User already exists");
    }

    const avatarLocalPath = req.files?.avatar[0].path
    const coverImageLocalPath = req.files?.cover[0].path

    console.log(`Avatar: ${avatarLocalPath}`);
    console.log(`Cover: ${coverImageLocalPath}`);
    
    if( !avatarLocalPath ){
        throw new apiErrors(400, "Avatar file is required");
    }

    const avatar = await fileUploaderOnCLoud(avatarLocalPath, "image"); 
    const coverImage = await fileUploaderOnCLoud(coverImageLocalPath, "image");

    if( !avatar ){
        throw new apiErrors(400, "Avatar file is required");
    }

    console.log(`avatar: ${avatar}`);
    console.log(`cover: ${coverImage}`);

    const newUser = await User.create(
        {
            fullName,
            userName: userName.toLowerCase(),
            email,
            password,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
        }
    )

    const newUserCreated = await User.findOne(newUser).select("-password -refreshToken");

    if( !newUserCreated ) {
        throw new apiErrors(500, "Failed to create user");
    }


    res.status(201).json(
        apiResponse(201, "User registered successfully")
    );
});
