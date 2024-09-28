import dayjs, { Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from 'dayjs/plugin/utc'

import { promises as fs } from 'fs';

import { z } from "zod";

dayjs.extend(timezone)
dayjs.extend(utc)

type Event = {
    name: string,
    start: Dayjs,
    end: Dayjs,
    location: string,
    description: string
}

const eventZod = z.object({
    name: z.string(),
    start: z.string().datetime({ offset: true }),
    end: z.string().datetime({ offset: true }),
    location: z.string(),
    description: z.string()
})

export function parseEvents(eventsJson: any): Event[] {

    let events: Event[] = []
    for (let event of eventsJson) {
        let parsedEvent = eventZod.safeParse(event)
        if (parsedEvent.success) {
            let date = dayjs(parsedEvent.data.start)
            events.push({
                name: parsedEvent.data.name,
                start: dayjs(parsedEvent.data.start),
                end: dayjs(parsedEvent.data.end),
                location: parsedEvent.data.location,
                description: parsedEvent.data.description
            })
        } else {
            console.error("Failed to parse event", event)
        }
    }

    return events
}