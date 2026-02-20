import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';

const registerUser= asyncHandler(async(req, res)=>{
    //get details from user
    //validation not empty
    //check if user already exists: username, email
    //check for images,check for avatar
    //upload to cloudinary, avatar
    //create user object - create entry in database
    //remove password and refresh token fields from the response
    //check user for creation
    //return response


    const{username, email, fullname, password} = req.body;
    //console.log("email", email);
    if(
        [username, email, fullname, password].some(field => !field ||
            field?.trim() === "")
    ){
        throw new ApiError( 400,"All fields are required")
    }
    const existingUser = await User.findOne({$or: [{email}, {username}]})
    if(existingUser){
        throw new ApiError(409,"User already exists with the provided email or username")
    }
    //console.log("req.files", req.files);

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverimage?.[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError( 400,"Avatar is required")
    }
    const avatar = await uploadToCloudinary(avatarLocalPath)
    const coverImage = await uploadToCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError( 400,"Avatar is required")
    }

     const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        username: username.toLowerCase(),
        password
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError("User registration failed", 500)
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser, "User registered successfully")
    )
})



export {registerUser}
