import dotenv from "dotenv";
import express from "express";
import dbConnection from "./db/dbConnection.js";

dotenv.config({path: "./env"});

const app = express();

const PORT = process.env.PORT || 8000;


dbConnection()
