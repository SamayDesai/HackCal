'use client'

import { useEffect, useState } from "react";
import { Event } from "./models";
import Navigation from '@/components/navbar';
import EventForm from '@/components/event-form';
import { Firestore } from "firebase/firestore";
import { useGoogleLogin } from "@react-oauth/google";
import dayjs from "dayjs";
import * as React from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTableChakra } from "./chakratabletester";

import { GetAllForUser, InitFirestore } from "./firebase/firestore";
import GetUserId from "./firebase/auth";

import { AddToCalendarButton } from "add-to-calendar-button-react"
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
          description={info.row.original.description}
          timeZone="America/New_York"
        ></AddToCalendarButton>
      ),
      header: "Actions"
    })
  ];

export default function Home() {
  const [events, setEvents] = useState<Event[]>([])
  const [db, setDb] = useState<Firestore>()
  const [authCode, setAuthCode] = useState<string>()
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [isEventsUpdated, setIsEventsUpdated] = useState<boolean>(false)
  const [userEmail, setUserEmail] = useState<string>();

  useEffect(() => {
    setDb(InitFirestore())
  }, [])

  useEffect(() => {
    console.log(db)

    const runDbStuff = async () => {
      if (db && userId) {
        GetAllForUser(db as Firestore, userId, setEvents)
      }
    }

    runDbStuff()
  }, [db, userId])

  useEffect(() => {
    const runAuthStuff = async () => {
      if (authCode) {
        console.log("Auth code received")
        const { userId, email } = await GetUserId(authCode)
        setUserId(userId)
        setUserEmail(email)
      }
    }

    runAuthStuff()

  }, [authCode])

  const login = useGoogleLogin({
      onSuccess: codeResponse => {
        setAuthCode(codeResponse.code)
      },
      flow: 'auth-code',
      scope: 'openid email profile https://www.googleapis.com/auth/calendar'
    });

    return (
        <div>
          <Navigation loginFunc={login} userEmail={userEmail} userId={userId} />
          <div>
            <EventForm
              events={events}
              setEvents={setEvents}
              setIsEventsUpdated={setIsEventsUpdated}
              userId={userId}
            />
          </div>
          <DataTableChakra columns={columns} data={events} />
        </div>
    )
  }