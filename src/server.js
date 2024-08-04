import dotenv from "dotenv";
import dbConnection from "./db/dbConnection.js";
import { app } from "./app.js";

dotenv.config({path: "./env"});

const PORT = process.env.PORT || 8000;


dbConnection()
.then(() =>{
    app.listen(PORT, ()=>{
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch(()=>{
    app.on('error',(err) =>{
        console.log(`Error in connection: ${err.message}`);
    })
});



