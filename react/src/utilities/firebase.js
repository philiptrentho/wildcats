import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, arrayUnion } from "firebase/firestore";
import { getDatabase, onValue, update } from 'firebase/database';
import React, { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "",
    authDomain: "wildcat-spotlight.firebaseapp.com",
    databaseURL: "https://wildcat-spotlight-default-rtdb.firebaseio.com",
    projectId: "wildcat-spotlight",
    storageBucket: "wildcat-spotlight.appspot.com",
    messagingSenderId: "2975426776",
    appId: "1:2975426776:web:b6130fa45757d9b0164fad",
    measurementId: "G-MRCQT3P74N"
};



const firebase = initializeApp(firebaseConfig);
export const database = getDatabase(firebase);

const storage = getStorage(firebase);
export const auth = getAuth(firebase)

if (!getApps().length) {
    initializeApp(firebaseConfig);
}

// Initialize Firestore
const app = getApps()[0]; // Gets the first initialized app
export const firestore = getFirestore(app);

// Initialize Firebase App only if there are no apps initialized yet
if (!getApps().length) {
    initializeApp(firebaseConfig);
}

export const uploadData = async (collectionName, documentID, documentData) => {
    const eventDocRef = doc(firestore, collectionName, documentID.toString());

    await setDoc(eventDocRef, documentData);

    console.log("Data slayed (uploaded)!")

}

export const writeEventData = async (event, imageFile) => {
    // Check if imageFile is provided
    if (imageFile) {
        // Create a storage reference for the image in Firebase Storage
        const storageRef = ref(storage, `eventImages/${event.eventID}`);

        try {
            // Upload the image to Firebase Storage
            const snapshot = await uploadBytes(storageRef, imageFile);
            // Get the URL of the uploaded image
            const imageUrl = await getDownloadURL(snapshot.ref);

            // Set the image URL in the event object
            event.eventPhoto = imageUrl;

            // Now proceed to write the event (with image URL) to Firestore
            const eventDocRef = doc(firestore, "events", event.eventID.toString());

            await setDoc(eventDocRef, event);

            console.log('Event and image have been written to Firestore');
        } catch (error) {
            console.error("Error uploading image and writing event data: ", error);
        }
    } else {
        // If no imageFile is provided, just write the event data to Firestore
        const eventDocRef = doc(firestore, "events", event.eventID.toString());

        await setDoc(eventDocRef, event);

        console.log('Event data (without image) has been written to Firestore');
    }
};



export const getEventData = async (eventID) => {
    const eventDocRef = doc(firestore, "events", eventID.toString());
    const eventDocSnap = await getDoc(eventDocRef);

    if (eventDocSnap.exists()) {
        console.log("Document data:", eventDocSnap.data());
        return eventDocSnap.data();
    } else {
        console.log("No such document!");
        return null;
    }
};


export const getAllEventsData = async () => {
    const eventsCollectionRef = collection(firestore, "events");
    const snapshot = await getDocs(eventsCollectionRef);
    const eventsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    eventsList.sort((a, b) => {
        return new Date(a.eventStart) - new Date(b.eventStart);
    });

    console.log("All events data:", eventsList);
    return eventsList;
};

export const getCurrentUserID = () => {
    const user = auth.currentUser;
    return user ? user.uid : null;
};

export async function getUserInfo() {

    const userID = getCurrentUserID()
    const userDocRef = doc(firestore, 'users', userID);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        return userData
    } else {
        console.log("No such document!");
    }


}

export async function addEventToOrganizer(organizerID, eventID) {
    try {
        console.log(organizerID, eventID)
        // Document reference for the specific organizer
        const organizerRef = doc(firestore, "users", organizerID);

        // Update the document by adding the event ID to the 'hostingEvents' array
        await updateDoc(organizerRef, {
            hostingEvents: arrayUnion(eventID.toString())
        });

        console.log(`Event ID ${eventID} added to the hostingEvents of organizer ${organizerID}`);
    } catch (error) {
        console.error("Error adding event to organizer:", error);
    }
}
