const {S3Client, GetObjectCommand, PutObjectCommand} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');


//S3 setup
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
})
const bucket_name = process.env.BUCKET_NAME;


const uploadFileToS3 = async (key,file)=>{

    const uploadParams  = {
        Bucket: bucket_name,
        Key: key, 
        Body: file.buffer,
        ContentType: file.mimetype,
    }
    try {
        await s3.send(new PutObjectCommand(uploadParams));
        console.log(`File uploaded!`);
        
    } catch (error) {
        console.log(`Error while uploading: ${error}`);
    }

}

const retrieveFileUrl = async (patientId, key) => {
    try {
        const url = await getSignedUrl(
            s3,
            new GetObjectCommand({
                Bucket: bucket_name,
                Key: `${patientId}/${key}`
            }),
            { expires : 60 }
        );
    
        return url;

    } catch (error) {
        console.log("Error in retrieving file ", error);                
    }
}

module.exports= {retrieveFileUrl, uploadFileToS3}