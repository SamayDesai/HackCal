// 'use client'

// import { useEffect, useState } from "react";
// import { Event, parseEvents } from "./models";
// import { InitOpenAi, ProcessImageRequest, TestApiCall, TestProcessImageRequest } from "./openai";
// import Navigation from '@/components/navbar';
// import EventForm from '@/components/event-form';
// import { Button } from "@chakra-ui/react";
// import { Firestore } from "firebase/firestore";
// import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
// import dayjs from "dayjs";
// import { GetAllForUser, InitFirestore } from "./firebase/firestore";

//   // TODO: Make backend API call to run OpenAI

//   type Repo = {
//     events: Event[]
//   }

//  export default function LoginButton() {
    
     
//   const [events, setEvents] = useState<Event[]>([])
//   const [db, setDb] = useState<Firestore>()
//   const [authCode, setAuthCode] = useState<string>()


//   useEffect(() => {
//     setDb(InitFirestore())

//     // const getEvents = async () => {
//     // // let openai = await InitOpenAi()
//     // // let test_call = await TestApiCall(openai)
//     // // let info = await ProcessImageRequest(openai, `./public/examples/Image from i.pinimg.com.jpg`);
//     // // let events = await TestProcessImageRequest()

//     //   // const eventsJson = await TestProcessImageRequest()
//     //   // const events = parseEvents(eventsJson)
//     //   // setEvents(events)

//     //   // for (let event of events) {
//     //   //   await WriteNewEvent("1", event)
//     //   // }
//     //   await TestGetAllForUser(db as Firestore, "1", setEvents)

//     // }
//     // getEvents()

//   }, []) // TODO: Remove empty array param

//   useEffect(() => {
//     console.log(db)
//     if (db) {
//       GetAllForUser(db as Firestore, "1", setEvents)
//     }
//   }, [db])

//   useEffect(() => {

//     if (authCode) {
//       console.log("Auth code received")



//     }

//   }, [authCode])

//   const login = useGoogleLogin({
//       onSuccess: codeResponse => {
//         setAuthCode(codeResponse.code)
//       },
//       flow: 'auth-code',
//       scope: 'https://www.googleapis.com/auth/calendar'
//     });

//   const getCalendar = async () => {

//   }

//     return (
// <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
//           <Button onClick={login}>Login with Google

//           </Button>

//           </GoogleOAuthProvider>
//     );
  
//   }
// //   export default function AuthWrapper(){
// //     <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
// //         <LoginButton></LoginButton>
// //     </GoogleOAuthProvider>
// //   }
