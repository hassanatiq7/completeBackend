import { v2 as cloudinary } from "cloudinary"
import fs from "fs";

const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_NAME} = process.env

cloudinary.config({ 
    cloud_name: CLOUDINARY_NAME, 
    api_key: CLOUDINARY_API_KEY, 
    api_secret: CLOUDINARY_API_SECRET
});

const fileUploaderOnCLoud = async ( localFilepath, imageFolder ) =>{
try {
        if(!localFilepath) return null;
    
        const cloudinaryResponse = await cloudinary.uploader.upload(localFilepath, {
            resource_type: 'auto',
            // folder:`${imageFolder}`,
            // use_filename: true,    
        }
        // ,function (error, result) {
        //     if (result.url) {
        //         resolve({ url: result.url })
        //     } else {
        //         reject({ message: "image upload fail", error })
        //     }
        // },
        );

        // console.log(`File Uploaded Sucessfully: ${cloudinaryResponse.url}`);
        // REMOVES THE FILE FROM TEMPORARY FOLDER IF THE FILE IS UPLOADED ON CLOUD.
        fs.unlink(localFilepath, (e) =>{
            if(e) console.error(`Error deleting file: ${e.message}`);
        })
        
        return cloudinaryResponse;
    } catch (error) {

    fs.unlinkSync(localFilepath); // REMOVES THE FILE FROM TEMPORARY FOLDER IF THE FILE IS NOT UPLOADED ON CLOUD.
    return null;
    }
}

export { fileUploaderOnCLoud };