const {initializeApp} = require("firebase/app");
const multer = require('multer');
const {getStorage, ref} = require('firebase/storage');


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChvqoBV75rrhb4rLvLzqC255TuvZz1L4w",
  authDomain: "hoodiee-dade7.firebaseapp.com",
  projectId: "hoodiee-dade7",
  storageBucket: "hoodiee-dade7.appspot.com",
  messagingSenderId: "161077426262",
  appId: "1:161077426262:web:13aec553cba3de848a23f7"
};

// Initialize Firebase
initializeApp(firebaseConfig);

const storage = getStorage();
const upload = multer({ storage: multer.memoryStorage() });


module.exports = {
    upload,
    storage
}