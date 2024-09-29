'use client'

import { useEffect, useState } from "react";
import { Event, parseEvents } from "./models";
import { Link } from '@chakra-ui/next-js'
import Image from "next/image";
import { InitOpenAi, ProcessImageRequest, TestApiCall, TestProcessImageRequest } from "./openai";
import Navigation from '@/components/navbar';
import EventForm from '@/components/event-form';
import { Button } from "@chakra-ui/react";
import { Firestore } from "firebase/firestore";
import { useGoogleLogin } from "@react-oauth/google";
import dayjs from "dayjs";
// import { GetAllForUser, InitFirestore } from "./firebase/firestore";
import { date, datetimeRegex } from "zod";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { GetAllForUser, InitFirestore, WriteNewEvent } from "./firebase/firestore";
import GetUserId from "./firebase/auth";

  // TODO: Make backend API call to run OpenAI

  type Repo = {
    events: Event[]
  }

export default function Home() {
  const [events, setEvents] = useState<Event[]>([])
  const [db, setDb] = useState<Firestore>()
  const [authCode, setAuthCode] = useState<string>()
  const [userId, setUserId] = useState<string>()


  useEffect(() => {
    setDb(InitFirestore())

    // const getEvents = async () => {
    // // let openai = await InitOpenAi()
    // // let test_call = await TestApiCall(openai)
    // // let info = await ProcessImageRequest(openai, `./public/examples/Image from i.pinimg.com.jpg`);
    // // let events = await TestProcessImageRequest()

    //   // const eventsJson = await TestProcessImageRequest()
    //   // const events = parseEvents(eventsJson)
    //   // setEvents(events)

    //   // for (let event of events) {
    //   //   await WriteNewEvent("1", event)
    //   // }
    //   await TestGetAllForUser(db as Firestore, "1", setEvents)

    // }
    // getEvents()

  }, []) // TODO: Remove empty array param

  useEffect(() => {
    console.log(db)

    const runDbStuff = async () => {
      if (db && userId) {
        const eventsJson = await TestProcessImageRequest()
        const events = parseEvents(eventsJson)
        setEvents(events)
        GetAllForUser(db as Firestore, userId, setEvents)

        // for (let event of events) {
        //   WriteNewEvent(db as Firestore, userId, event)
        // }
      }
    }

    runDbStuff()
  }, [db, userId])

  // const insertEvent = async () => {

  //   var event = {
  //     summary: 
  //     location: 
  //     description: 
  //     start: {
  //       dateTime: 
  //       timeZone:
  //     }
  //     end: {
  //       datetime: 
  //       timeZone:
  //     }
  //  OPTION A: 
  //  try {    
  //     const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
  //       method: 'POST',
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(event),
  //     });
  
  //     const data = await response.json();
  //     console.log('Event created: ', data);
  //   } catch (error) {
  //     console.error('Error creating event: ', error);
  //   }

  // OPTION B: 
  // calendar.events.insert({
  //   auth: auth, 
  //   calendarId: 'primary',
  //   resource: event
  // }, function(err, event) {
  //   if (err) {
  //     console.log('There was an error contacting the Calendar service: ' + err);
  //     return;
  //   }
  //   console.log('Event created: %s', event.htmlLink);
  // });
  // }

    useEffect(() => {

      const runAuthStuff = async () => {
        if (authCode) {
          console.log("Auth code received")

          setUserId(await GetUserId(authCode))

        }
      }

      runAuthStuff()

    }, [authCode])

  const login = useGoogleLogin({
      onSuccess: codeResponse => {
        setAuthCode(codeResponse.code)
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
                  <p>&emsp;Start: {dayjs(event.start).format("dddd, MMMM D, YYYY h:mm A")}</p>
                  <p>&emsp;End: {dayjs(event.end).format("dddd, MMMM D, YYYY h:mm A")}</p>
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
