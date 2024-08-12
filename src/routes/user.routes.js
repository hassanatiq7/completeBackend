import express from "express";
import verifYJWT from "../middlewares/verifyAuth.js";
import upload from "../middlewares/multer.middleware.js";
import { changePassword,
    getCurrentUser,
    updateFullName,
    updateAvater } from "../controllers/user.controllers.js";

const router = express.Router();

router.post("/changepassword", verifYJWT, changePassword);

router.get("/getuser", verifYJWT, getCurrentUser);

router.patch("/changename", verifYJWT, updateFullName);

router.patch("/updateavater", verifYJWT,
    upload.single("avatar"), 
    updateAvater);

export default router;