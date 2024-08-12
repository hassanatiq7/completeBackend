import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const { ORIGIN, DATA_LIMIT } = process.env

app.use(cors({
    credentials: true,
    origin: ORIGIN
}));

app.use(express.json(
    {
        limit: DATA_LIMIT
    }
));

app.use(express.urlencoded({ extended: true, limit: DATA_LIMIT }));

app.use(cookieParser());
app.use(express.static("public"))


//IMPORT ROUTES
import authRoutes from "./routes/auth.routes.js"
import usersRoutes from "./routes/user.routes.js"


//ROUTES DECLARATION
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", usersRoutes);



export { app };