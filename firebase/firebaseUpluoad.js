const express = require('express');
const multer = require('multer');
const admin = require('firebase-admin');
const path = require('path');
const serviceAccount = require('../firebase/firebaseConfig')

const confing = serviceAccount.serviceAccount; // Ruta al archivo de clave de servicio de Firebase


// Configuración de Firebase
admin.initializeApp({
  credential: admin.credential.cert(confing),
  storageBucket: process.env.storageBucket, // Reemplaza con el ID de tu aplicación
});

const bucket = admin.storage().bucket();

// Configuración de Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


module.exports ={
    bucket,
    upload
}