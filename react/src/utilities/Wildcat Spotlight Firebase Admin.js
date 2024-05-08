
require('dotenv').config();

const admin = require('firebase-admin');

const projectId = process.env.PROJECT_ID;
const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.PROJECT_ID,
    privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.CLIENT_EMAIL,
    clientId: process.env.CLIENT_ID,
    authUri: "https://accounts.google.com/o/oauth2/auth",
    tokenUri: "https://oauth2.googleapis.com/token",
    authProviderX509CertUrl: "https://www.googleapis.com/oauth2/v1/certs",
    clientX509CertUrl: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.CLIENT_EMAIL.replace('@', '%40')}`
  })
});

