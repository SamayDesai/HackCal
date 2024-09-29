'use client'

  import { useEffect, useState } from "react";
  import { Event, parseEvents } from "./models";
  import { Link } from '@chakra-ui/next-js'
  import Image from "next/image";
  import { InitOpenAi, ProcessImageRequest, TestApiCall, TestProcessImageRequest } from "./openai";
  import Navigation from '@/components/navbar';
  import EventForm from '@/components/event-form';

  //imports here are for the Firebase SDK
  import { signInWithPopup, User } from "firebase/auth";
  import { auth, provider } from "./firebaseConfig"; // Import your Firebase configuration
import { GoogleLogin, hasGrantedAllScopesGoogle, hasGrantedAnyScopeGoogle, useGoogleLogin } from "@react-oauth/google";
import { Button } from "@chakra-ui/react";

  // TODO: Make backend API call to run OpenAI

  type Repo = {
    events: Event[]
  }

  export default function Home() {
    const [events, setEvents] = useState<Event[]>([])

    useEffect(() => {
      const getEvents = async () => {
        // let openai = await InitOpenAi()
        // let test_call = await TestApiCall(openai)
        // let info = await ProcessImageRequest(openai, `./public/examples/Image from i.pinimg.com.jpg`);
        // let events = await TestProcessImageRequest()

        const eventsJson = await TestProcessImageRequest()
        setEvents(parseEvents(eventsJson))
      }

      getEvents()
    }, []) // TODO: Remove empty array param

    const login = useGoogleLogin({
      onSuccess: codeResponse => {
        console.log(codeResponse.scope)
      },
      flow: 'auth-code',
      scope: 'https://www.googleapis.com/auth/calendar'
    });

    return (
      <div>
        <Navigation />
        <div>
          <EventForm />
          {
            events.map((event, i) => {
              return (
                <div key={i}>
                  <h2>{event.name}</h2>
                  <p>&emsp;Start: {event.start.format("dddd, MMMM D, YYYY h:mm A")}</p>
                  <p>&emsp;End: {event.end.format("dddd, MMMM D, YYYY h:mm A")}</p>
                  <p>&emsp;Location: {event.location}</p>
                  <p>&emsp;Description: {event.description}</p>
                </div>
              )
            })
          }
        </div>
        <div>

          <Button onClick={login}>Login with Google</Button>


        </div>
      </div>
    );
  }

// 'use client'

// import { useEffect, useState } from "react";
// import { Event, parseEvents } from "./models";
// import { Link } from '@chakra-ui/next-js'
// import Image from "next/image";
// import { InitOpenAi, ProcessImageRequest, TestApiCall, TestProcessImageRequest } from "./openai";
// import Navigation from '@/components/navbar';
// import EventForm from '@/components/event-form';

// //imports here are for the Firebase SDK
// import { signInWithPopup, User } from "firebase/auth";
// import { auth, provider } from "./firebaseConfig"; // Import your Firebase configuration



// // TODO: Make backend API call to run OpenAI

// type Repo = {
//   events: Event[]
// }

// export default function Home() {
//   const [events, setEvents] = useState<Event[]>([])

//   useEffect(() => {
//     const getEvents = async () => {
//     // let openai = await InitOpenAi()
//     // let test_call = await TestApiCall(openai)
//     // let info = await ProcessImageRequest(openai, `./public/examples/Image from i.pinimg.com.jpg`);
//     // let events = await TestProcessImageRequest()

//       const eventsJson = await TestProcessImageRequest()
//       setEvents(parseEvents(eventsJson))
//     }

//     getEvents()
//   }, []) // TODO: Remove empty array param


//   // firebase google login test 
  
//   const [user, setUser] = useState<User | null>(null);

//   const login = async () => {
//     try {
//       const result = await signInWithPopup(auth, provider);
//       setUser(result.user);
//       console.log(result.user);
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   //firebase google login test end

//   return (
//     //firebase google login test
//   //   <div>
//   //     <h1>Google Calendar Integration</h1>
//   //     {user ? (
//   //       <p>Welcome, {user.displayName}</p>
//   //     ) : (
//   //       <button onClick={login}>Login with Google</button>
//   //     )}
//   //   </div>
//   // );
//   //firebase google login test end




//     // <div>
//     //   <h1>HackCal!</h1>


//     // </div>
//     <div>
//     <Navigation>


//     </Navigation>
//     <div>
//       <EventForm>

//         </EventForm>


//         {
//           events.map((event, i) => {
//             return (
//               <div key={i}>
//                 <h2>{event.name}</h2>
//                 <p>&emsp;Start: {event.start.format("dddd, MMMM D, YYYY h:mm A")}</p>
//                 <p>&emsp;End: {event.end.format("dddd, MMMM D, YYYY h:mm A")}</p>
//                 <p>&emsp;Location: {event.location}</p>
//                 <p>&emsp;Description: {event.description}</p>
//               </div>
//             )
//           })


//         }
//       </div>
//     </div>
  


//   );
// }
