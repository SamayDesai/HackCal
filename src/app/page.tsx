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

import { GetAllForUser, InitFirestore } from "./firebase/firestore";
import { DataTable } from "./eventlist/components/data-table";
// import { columns } from "./eventlist/components/columns"
import { UserNav } from "./eventlist/components/user-nav"
import { taskSchema } from "./eventlist/data/schema"
import { z } from "zod"
//import { promises as fs } from "fs"
import path from "path"
import { Metadata } from "next"
import { DataTableDemo } from "./tabletester";

import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTableChakra } from "./chakratabletester";

import { GetAllForUser, InitFirestore, WriteNewEvent } from "./firebase/firestore";
import GetUserId from "./firebase/auth";


  // TODO: Make backend API call to run OpenAI

  type Repo = {
    events: Event[]
  }

  type UnitConversion = {
    fromUnit: string;
    toUnit: string;
    factor: number;
  };
  
  const data: UnitConversion[] = [
    {
      fromUnit: "inches",
      toUnit: "millimetres (mm)",
      factor: 25.4
    },
    {
      fromUnit: "feet",
      toUnit: "centimetres (cm)",
      factor: 30.48
    },
    {
      fromUnit: "yards",
      toUnit: "metres (m)",
      factor: 0.91444
    }
  ];
  
  const columnHelper = createColumnHelper<UnitConversion>();
  
  const columns = [
    columnHelper.accessor("fromUnit", {
      cell: (info) => info.getValue(),
      header: "To convert"
    }),
    columnHelper.accessor("toUnit", {
      cell: (info) => info.getValue(),
      header: "Into"
    }),
    columnHelper.accessor("factor", {
      cell: (info) => info.getValue(),
      header: "Multiply by",
      meta: {
        isNumeric: true
      }
    })
  ];
  
  // export function App() {
  //   return (
  //     <ChakraProvider>
  //       <DataTableChakra columns={columns} data={data} />
  //     </ChakraProvider>
  //   );
  // }


export default function Home() {
  const [events, setEvents] = useState<Event[]>([])
  const [db, setDb] = useState<Firestore>()
  const [authCode, setAuthCode] = useState<string>()
  const [userId, setUserId] = useState<string>()

//   const eventsJSON = [
//     {
//       "id": "TASK-8782",
//       "title": "You can't compress the program without quantifying the open-source SSD pixel!",
//       "status": "in progress",
//       "label": "documentation",
//       "priority": "medium"
//     },
//     {
//       "id": "TASK-7878",
//       "title": "Try to calculate the EXE feed, maybe it will index the multi-byte pixel!",
//       "status": "backlog",
//       "label": "documentation",
//       "priority": "medium"
//     },
//     {
//       "id": "TASK-7839",
//       "title": "We need to bypass the neural TCP card!",
//       "status": "todo",
//       "label": "bug",
//       "priority": "high"
//     },
//     {
//       "id": "TASK-5562",
//       "title": "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
//       "status": "backlog",
//       "label": "feature",
//       "priority": "medium"
//     }]


  // useEffect(() => {
  //   setDb(InitFirestore())

  //   return (
  //   <DataTableDemo></DataTableDemo>
  //   )

  //   const getEvents = async () => {
  //   // let openai = await InitOpenAi()
  //   // let test_call = await TestApiCall(openai)
  //   // let info = await ProcessImageRequest(openai, `./public/examples/Image from i.pinimg.com.jpg`);
  //   // let events = await TestProcessImageRequest()

  //   //   const eventsJson = await TestProcessImageRequest()
  //   //   const events = parseEvents(eventsJson)
  //   //   setEvents(events)

  //   //   for (let event of events) {
  //   //     await WriteNewEvent("1", event)
  //   //   }
  //   // await TestGetAllForUser(db as Firestore, "1", setEvents)

  //   // }
  //   getEvents()

  // }, []) // TODO: Remove empty array param

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


    if (authCode) {
      console.log("Auth code received")

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

  const getCalendar = async () => {

  }


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


        <DataTableChakra columns={columns} data={data} />

        <div>

          <Button onClick={login}>Login with Google</Button>


        </div>
      </div>
    );
  }

  // async function getTasks() {
  //   const data = await fs.readFile(
  //     path.join(process.cwd(), "app/eventlist/components/data/tasks.json")
  //   )
  
  //   const tasks = JSON.parse(data.toString())
  
  //   return z.array(taskSchema).parse(tasks)
  // }
  
  // export async function TaskPage() {
  //   const tasks = await getTasks()
  
  //   return (
  //     <>
  //       {/* <div className="md:hidden">
  //         <Image
  //           src="/examples/tasks-light.png"
  //           width={1280}
  //           height={998}
  //           alt="Playground"
  //           className="block dark:hidden"
  //         />
  //         <Image
  //           src="/examples/tasks-dark.png"
  //           width={1280}
  //           height={998}
  //           alt="Playground"
  //           className="hidden dark:block"
  //         />
  //       </div>
  //       <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
  //         <div className="flex items-center justify-between space-y-2">
  //           <div>
  //             <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
  //             <p className="text-muted-foreground">
  //               Here&apos;s a list of your tasks for this month!
  //             </p>
  //           </div>
  //           <div className="flex items-center space-x-2">
  //             <UserNav />
  //           </div>
  //         </div> */}

  //       {/* <div> 
  //         <DataTable data={tasks} columns={columns} />
  //       </div>
  //     </> */}
  //   )
  // }
