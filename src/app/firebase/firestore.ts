import { FirebaseOptions } from "firebase/app";
import firebase from "firebase/compat/app";
import { addDoc, collection, Firestore, getDoc, getDocs, getFirestore, initializeFirestore, onSnapshot, orderBy, query, where } from "firebase/firestore";
import dayjs, { Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from 'dayjs/plugin/utc'

import { Event } from "../models"

export function InitFirestore() {

    console.log(process.env["NEXT_PUBLIC_FIREBASE_PROJECT_ID"])
    console.log(process.env["NEXT_PUBLIC_FIREBASE_API_KEY"])

    const firebaseConfig: FirebaseOptions  = {
        apiKey: process.env["NEXT_PUBLIC_FIREBASE_API_KEY"],
        authDomain: process.env["NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"],
        projectId: process.env["NEXT_PUBLIC_FIREBASE_PROJECT_ID"],
        storageBucket: process.env["NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"],
        messagingSenderId: process.env["NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"],
        appId: process.env["NEXT_PUBLIC_FIREBASE_APP_ID"],
        measurementId: process.env["NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID"]
    }

    const app = firebase.initializeApp(firebaseConfig);

    // initialize firestore
    return initializeFirestore(app, {
        experimentalForceLongPolling: true,
    })
    // return getFirestore(app, "(default)")

}

export function WriteNewEvent(db: Firestore, user_id: string, event: Event) {

    dayjs.extend(timezone)
    dayjs.extend(utc)

    addDoc(collection(db, `users/${user_id}/events/`), {
        name: event.name,
        start: dayjs(event.start).format(),
        end: dayjs(event.end).format(),
        location: event.location,
        description: event.description,
        createdAt: dayjs().tz().format()
    })

}

export function GetAllForUser(db: Firestore, user_id: string, setEvents: (events: Event[]) => void) {
    onSnapshot(query(collection(db, `users/${user_id}/events`), orderBy("createdAt", "desc")), (snapshot) => {
        const events: Event[] = []
        for (const event of snapshot.docs) {
            events.push(event.data() as Event)
        }
        console.log(events)
        setEvents(events)
    }, (error) => console.log(error.cause))


}
