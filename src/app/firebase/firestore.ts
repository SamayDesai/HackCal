'use server'

import { FirebaseOptions } from "firebase/app";
import firebase from "firebase/compat/app";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import dayjs, { Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from 'dayjs/plugin/utc'

import { Event } from "../models"

export async function InitFirestore() {

    const firebaseConfig: FirebaseOptions  = {
        apiKey: process.env["FIREBASE_API_KEY"],
        authDomain: process.env["FIREBASE_AUTH_DOMAIN"],
        projectId: process.env["FIREBASE_PROJECT_ID"],
        storageBucket: process.env["FIREBASE_STORAGE_BUCKET"],
        messagingSenderId: process.env["FIREBASE_MESSAGING_SENDER_ID"],
        appId: process.env["FIREBASE_APP_ID"],
        measurementId: process.env["FIREBASE_MEASUREMENT_ID"]
    }

    const app = firebase.initializeApp(firebaseConfig);

    // initialize firestore
    return getFirestore(app)

}

export async function WriteNewEvent(user_id: string, event: Event) {

    const db = await InitFirestore()
    dayjs.extend(timezone)
    dayjs.extend(utc)

    await addDoc(collection(db, `users/${user_id}/events/`), {
        name: event.name,
        start: dayjs(event.start).format(),
        end: dayjs(event.end).format(),
        location: event.location,
        description: event.description,
        createdAt: dayjs().tz().format()
    })

}

// export async function TestGetAll() {

//     const db = await InitFirestore()

//     db.collection("cities").doc("SF")
//         .onSnapshot((doc) => {

//         });

// }
