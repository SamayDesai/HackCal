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

// import { GetAllForUser, InitFirestore } from "./firebase/firestore";
import { date, datetimeRegex } from "zod";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { DeleteAllForUser, GetAllForUser, InitFirestore, WriteNewEvent } from "./firebase/firestore";
import GetUserId from "./firebase/auth";
import { info } from "console";

import { AddToCalendarButton } from "add-to-calendar-button-react"


  // TODO: Make backend API call to run OpenAI

  type Repo = {
    events: Event[]
  }

  type UnitConversion = {
    fromUnit: string;
    toUnit: string;
    factor: number;
  };

  const data: Event[] = [
    {
      name: "Birthday Party",
      start: dayjs("2023-12-25T10:30:00Z"),
      end: dayjs("2023-12-25T10:32:00Z"),
      location: "Kyle's House",
      description: "Kyle's 10th birthday party!!"
      
    },
    {
      name: "Assignment Due for Class",
      start: dayjs("2024-11-25T10:30:00Z"),
      end: dayjs("2024-11-25T10:30:00Z"),
      location: "",
      description: "Assigment for Computer Science"
      
    },
    {
      name: "Grandmother's House",
      start: dayjs("2025-10-28T10:30:00Z"),
      end: dayjs("2025-10-31T10:30:00Z"),
      location: "Grandmother's House",
      description: ""
      
    },
    // {
    //   name: "Hi",
    //   start: dayjs("2023-12-25T10:30:00Z"),
    //   end: dayjs("2023-12-25T10:30:00Z"),
    //   location: "Potato",
    //   description: "Tomato"
    // }
  ];

  const columnHelper = createColumnHelper<Event>();

  const columns = [
    columnHelper.accessor("name", {
      cell: (info) => info.getValue(),
      header: "Name"
    }),
    columnHelper.accessor("location", {
      cell: (info) => info.getValue(),
      header: "Location"
    }),
    columnHelper.accessor("start", {
      cell: (info) => dayjs(info.getValue()).format("dddd, MMMM D, YYYY h:mm A"),
      header: "Start",
      meta: {
        isDate: true
      }
    }),
    columnHelper.accessor("end", {
      cell: (info) => dayjs(info.getValue()).format("dddd, MMMM D, YYYY h:mm A"),
      header: "End",
      meta: {
        isDate: true
      }
    }),
    columnHelper.display({
      cell: (info) => (
        <AddToCalendarButton
          name={info.row.original.name}
          options={['Apple', 'Google']}
          location={info.row.original.location}
          startDate={dayjs(info.row.original.start).format("YYYY-MM-DD")}
          endDate={dayjs(info.row.original.end).format("YYYY-MM-DD")}
          startTime={dayjs(info.row.original.start).format("HH:mm")}
          endTime={dayjs(info.row.original.end).format("HH:mm")}
          timeZone="America/New_York"
        ></AddToCalendarButton>
      ),
      header: "Actions"
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
  const [isEventsUpdated, setIsEventsUpdated] = useState<boolean>(false)

  const prevEvents = React.useRef<Event[]>([])

//   const eventsJSON = [
//     {
//       "id": "TASK-8782",
//       "title": "You can't compress the program without quantifying the open-source SSD pixel!",
//       "status": "in progress",
//       "label": "documentation",
//       "priority": "medium"
//     },
// name: string,
//     start: Dayjs,
//     end: Dayjs,
//     location: string,
//     description: string
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


  useEffect(() => {
    setDb(InitFirestore())

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

  }, []) // TODO: Remove empty array param

  useEffect(() => {
    console.log(db)

    const runDbStuff = async () => {
      if (db && userId) {
        GetAllForUser(db as Firestore, userId, setEvents)


        // for (let event of events) {
        //   WriteNewEvent(db as Firestore, userId, event)
        // }
      }
    }

    runDbStuff()
  }, [db, userId])

  useEffect(() => {
    if (db && userId && isEventsUpdated) {
      DeleteAllForUser(db, userId)
      for (let event of events) {
        WriteNewEvent(db, userId, event)
      }
      setIsEventsUpdated(false)
    }
  }, [events])

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
        <Navigation loginFunc={login} />
        <div>
          <EventForm events={events} setEvents={setEvents} setIsEventsUpdated={setIsEventsUpdated} />
        </div>


        <DataTableChakra columns={columns} data={data} />

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
