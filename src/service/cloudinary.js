import { v2 as cloudinary } from "cloudinary"
import fs from "fs";

const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_NAME} = process.env

cloudinary.config({ 
    cloud_name: CLOUDINARY_NAME, 
    api_key: CLOUDINARY_API_KEY, 
    api_secret: CLOUDINARY_API_SECRET
});

const fileUploaderOnCLoud = async (localFilepath) =>{
try {
        if(!localFilepath) return null;
    
        const cloudinaryResponse = await cloudinary.uploader.upload(localFilepath, {
            resource_type: 'auto',    
        });

        console.log(`File Uploaded Sucessfully: ${cloudinaryResponse}`);

        fs.unlinkSync(localFilepath); // REMOVES THE FILE FROM TEMPORARY FOLDER IF THE FILE IS UPLOADED ON CLOUD.
        return cloudinaryResponse;
        
    } catch (error) {

    fs.unlink(localFilepath); // REMOVES THE FILE FROM TEMPORARY FOLDER IF THE FILE IS NOT UPLOADED ON CLOUD.
    return null;
    }
}

export { fileUploaderOnCLoud };