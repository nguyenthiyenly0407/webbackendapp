import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
export class FirebaseUploadUtil {
    constructor(){
    }

    async uploadFile(file) {
        const bucket = admin.storage().bucket();
        const blob = bucket.file(file.originalname);
        console.log(blob.name);
        
    
        const blobWriter = await blob.createWriteStream({
            metadata: {
                contentType: file.mimetype,
                metadata: {
                    firebaseStorageDownloadTokens: "wecommunity"
                }
            }
        })
        
        blobWriter.on('error', (err) => {
            console.log(err)
        })
        
        blobWriter.on('finish', () => {
        })
        
        blobWriter.end(file.buffer);
    }
    getUrlUpload(fileName: string): string {
        return 'https://firebasestorage.googleapis.com/v0/b/wecommunity-204bd.appspot.com/o/' + fileName + '?alt=media&token=wecommunity';
    } 

    async downloadFile(filename: string) {
        let destFilename = './download/' + filename;
        const options = {
            destination: destFilename,
        };
        const image = await admin.storage().bucket().file(filename).download(options);
        return image;
    }
}