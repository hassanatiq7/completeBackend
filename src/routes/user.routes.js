import express from "express";
import verifYJWT from "../middlewares/verifyAuth.js";
import upload from "../middlewares/multer.middleware.js";
import { changePassword,
    getCurrentUser,
    updateFullName,
    updateAvatar } from "../controllers/user.controllers.js";

const router = express.Router();

router.post("/changepassword", verifYJWT, changePassword);

router.get("/getuser", verifYJWT, getCurrentUser);

router.patch("/changename", verifYJWT, updateFullName);

router.patch("/updateavatar", verifYJWT,
    upload.single("avatar"), 
    updateAvatar);

export default router;