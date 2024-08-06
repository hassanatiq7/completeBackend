import { Router } from "express";
import { registerUser, loginUser, logout, refreshAccessToken } from "../controllers/auth.controllers.js";
import upload from "../middlewares/multer.middleware.js";
import verifYJWT from "../middlewares/verifyAuth.js";

const router = Router();

router.post("/register", upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
]),
registerUser,
);

router.post("/login", loginUser);

router.post("/logout", verifYJWT,logout);

router.post("/refresh", refreshAccessToken);

export default router;