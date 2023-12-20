import {ref, getDownloadURL, uploadBytesResumable} from 'firebase/storage';
import {storage} from '../firebase/firebase.js'



export async function subirArcivoFb(file) {

    const filesRef = ref(storage, `files/${file.originalname} ${Date.now()}`);

    const filesData = {
        contentType: file.mimetype
    }

    const fileSubir = uploadBytesResumable(
        filesRef,
        filesData
    )

    await fileSubir();

    const filesUrl = await getDownloadURL(filesRef);


    return {ref:filesRef, downloadUrl:filesUrl}

    
}
