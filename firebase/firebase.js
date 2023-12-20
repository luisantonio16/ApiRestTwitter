import {initializeApp} from 'firebase/app';
import {getStorage}  from 'firebase/storage';
import dotenv from 'dotenv';

dotenv.config();


const firebaseConfi = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId
}

// Initialize Firebase
const app = initializeApp(firebaseConfi);

export const storage = getStorage(app);