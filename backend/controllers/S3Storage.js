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


const uploadFileToS3 = async (patientId,file)=>{
    const uploadParams  = {
        Bucket: bucket_name,
        Key: `${patientId}/${Date.now()}-${file.originalname}`, 
        Body: file.buffer,
        ContentType: file.mimetype,
    }
    try {
        const data = await s3.send(new PutObjectCommand(uploadParams));
        console.log(`File uploaded!`);
        uploadedFilesInfo.push({key: uploadParams.Key, type: uploadParams.ContentType});
        
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
    
        res.send(url);

    } catch (error) {
        console.log("Error in retrieving file ", error);        
        res.send(error);
    }
}

module.exports= {retrieveFileUrl, uploadFileToS3}