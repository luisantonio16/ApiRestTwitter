
const serviceAccount = {
    apiKey: process.env.apiKey,
    authDomain:process.env.authDomain,
    projectId:process.env.projectId,
    storageBucket:process.env.storageBucket,
    messagingSenderId:process.env.messagingSenderId,
    appId:process.env.appId
}

module.exports = {
   serviceAccount
}