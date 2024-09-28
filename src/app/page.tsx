'use client'

import Image from "next/image";
import { InitOpenAi, ProcessImageRequest, TestApiCall, TestProcessImageRequest } from "./openai";
import { useEffect, useState } from "react";
import { Event, parseEvents } from "./models";

// TODO: Make backend API call to run OpenAI

type Repo = {
  events: Event[]
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    const getEvents = async () => {
    // let openai = await InitApiCall()
    // let test_call = await TestApiCall(openai)
    // let info = await ProcessImageRequest(openai, `./public/examples/Image from i.pinimg.com.jpg`);
    // let events = await TestProcessImageRequest()

      const eventsJson = await TestProcessImageRequest()
      setEvents(parseEvents(eventsJson))
    }

    getEvents()
  })


  return (
    <div>
      <h1>HackCal!</h1>

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
  );
}
