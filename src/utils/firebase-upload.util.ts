import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
export class FirebaseUploadUtil {
    // adminConfig: ServiceAccount = {
    //     "projectId": "app-chat-coding-club",
    //     "privateKey": ("-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCy679pDDCNDT5w\n+/GdSSxg9sLJBsZF0/IdIvfQ+tIbKNYF2rUSC7qjtnWd/TwFMcuk6nAkf/eP67zn\n+N/7O0M66hvzAZ20K58S5NsnDjYNWqncSTZ2cKpuiKSz+/jMLkFGxd+GNUSMEhFr\nL+OntIvqQcmjMdBOhUgz0Dnmgo+fvXgP6gzNlXB/V/UPh46GUoc3WI+Tvhop5QES\nur7hed8O70RegTk83/QIamwePUtJb0c3q9IDJ5ZFcx3oumLiyXm3Yean3cd3Kchp\neW9NH/zK6QHZTcdbWSPs64be4e5U3heeQ7bBBnNl2lc6bEptVv42qJFXmQxDpn8d\n0ksHVDqtAgMBAAECggEAArd2enlt/Z+d8IMReK5Sf0Nn6DuohDQTDkhduRLXNgSG\noWP1fAlpDft4fuEINFpR9FZUmb1GrJerUIi0b+uxr4yRRufh9YkfBcoAni/GotPF\nq1ECQ8XzVIZ8cmN+SYK0njGQHV55hLib1+6MIfD+xIcMsSQRvLYkh0LfX4W2eWSq\nxRlLB05MRzcrt3bNQ+hUzUziX5+484g+S2SVG65AJhVMQtJ+1R5cSYfAtjNlAHLz\nHNpcySi/cW35aTcl6BlVW4DZlLu8hxUgDXtsjIKEjuNGVCbXsoL7ocMVi2bCIN95\nz3MpGoN8L9n5kjxwwnQSKRi96M2ZugzqoB3mKnDmsQKBgQD1shWjM2C+a87aYomR\n0CFnFyYyg0hmz2wJN0C3Ovg2wvJjDPKo3LjHKEc8jlURCJze4SxJ7/W2n2h4Kv+d\ng6yEUU98r/Qc1M+YH5u2rz5q4M8VLDpZn1T+7FEkHDraPkDetqcGDUVLGQYW3FGY\nsp9bz6lGV1tdYJ0g1UDNLIRAMQKBgQC6bLwh7buhgC3FbAyoFP2Y4LYqxFPZ1bH5\nuvbeDk5reZoLdSo71bHjARmVUoWqGLN6HlXGq6iTN3tZWVaT6cKQCRTmjIe7RjvL\n7Xibq4U8vb6gIyNKDhSHmbSysA059VB9HtiDFB7LCm9AgZqT1AQIwColwBJ/cmzH\nAM55+PsfPQKBgQC/ccY+ZnhJqEOEEyfSwHRmmbkfvwAZbCJog+8fVwm10e2AlMQ4\nI9SvComHe/h4z1c8rAQQkLPLWybSC98lY0Z3y8u+AnSaSpB/npF8pcxjB00U2GOX\nFfnqsUUAeCa7i6qMX5KBurF1tMfz5DSIYRafOY5SyxrcBb4pqUFXHgrm4QKBgFKF\nY1nZdB7vMFOdmpSkhgUwIzMXKM7aSyfyXOi6iHgGoevEd2d5Fn8Xs41ntAcxW/EI\nkIua3Mod2xoX870R0rATdQ8A0exSEJIakjLGX/odO86C/1H+nZPQtC4MxC4Nqw1X\npBuRwne6LLjvJc+eIBMHjSCcvxNvQTtt3fgcAH05AoGAPUjTluaFVVPPP7YgXWzf\nA7xoUspTv/uS0M4zLJrbHpoA3XXhsf9IIfk9NJaTH1pWu5dQS6IXtgPsrH7ouuMA\nDdbJruAEDfnQpcdQv5YdqunIblKygsfVCn91DCN9Y10mb8nh03WxFcYntd951cgI\nLrEcRzkce2HK25YaPu8WIgA=\n-----END PRIVATE KEY-----\n").replace(/\\n/g, '\n'),
    //     "clientEmail": "firebase-adminsdk-3rhx6@app-chat-coding-club.iam.gserviceaccount.com",
    //   };
    constructor(){
        // admin.initializeApp({
        //     credential: admin.credential.cert(this.adminConfig),
        //     storageBucket: 'app-chat-coding-club.appspot.com'
        // });
    }

    async uploadFile(file) {
        const bucket = admin.storage().bucket();
        const blob = bucket.file(file.originalname);
        console.log(blob.name);
        
    
        const blobWriter = await blob.createWriteStream({
            metadata: {
                contentType: file.mimetype,
                metadata: {
                    firebaseStorageDownloadTokens: "coding-club"
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
        return 'https://firebasestorage.googleapis.com/v0/b/app-chat-coding-club.appspot.com/o/' + fileName + '?alt=media&token=coding-club';
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