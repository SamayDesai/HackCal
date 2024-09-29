import { FirebaseOptions } from "firebase/app";
import firebase from "firebase/compat/app";
import { addDoc, collection, Firestore, getFirestore, onSnapshot, query, where } from "firebase/firestore";
import dayjs, { Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from 'dayjs/plugin/utc'

import { Event } from "../models"

export function InitFirestore() {

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
    onSnapshot(collection(db, `users/${user_id}/events/`), (snapshot) => {
        const events: Event[] = []
        const eventsSnapshot = snapshot.docs.sort((a, b) => {
            return dayjs(b.get("createdAt")).unix() - dayjs(a.get("createdAt")).unix()
        })
        for (const event of eventsSnapshot) {
            events.push(event.data() as Event)
        }
        setEvents(events)
    })


}
