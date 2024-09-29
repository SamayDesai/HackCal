'use server'

import OpenAI from "openai"
import { promises as fs } from 'fs';
import { Event, parseEvents } from "./models";

export async function ProcessImage(file: string, events: Event[], setEvents: (events: Event[]) => void) {
    let openai = await InitOpenAi()
    let newEvents = await ProcessImageRequest(openai, file)
    setEvents(newEvents.concat(events))
}

export async function InitOpenAi() {
    return new OpenAI({
        apiKey: process.env["OPENAI_API_KEY"]
    })
}

export async function TestApiCall(openai: OpenAI) {
    const response = await openai.chat.completions.create({
      messages: [{ role: 'user', content: 'Say this is a test' }],
      model: 'gpt-4o-mini',
    }).asResponse()

    return response
}

// TODO: Modify return type to just be JSON, parse to Event later
export async function ProcessImageRequest(openai: OpenAI, file_path: string) {
    const imageBuffer = await fs.readFile(file_path);
    const base64Image = imageBuffer.toString('base64');
    const encodedImage = `data:image/jpeg;base64,{${base64Image}}`;

    const events = await parseImageForEvents(openai, encodedImage)

    return events
}

export async function TestProcessImageRequest() {
    const eventsText = await fs.readFile("./public/data/Image from i.pinimg.com_events.json")
    const eventsJson = JSON.parse(eventsText.toString())
    return eventsJson
    // const events = parseEvents(eventsJson)
    // return events
}

async function parseImageForEvents(openai: OpenAI, encoded_image: string) {

    const EVENTS_PROMPT = "Take the information off of this image. Collect all event names and their associated start and end times. Store this in a JSON format with each event being represented as a JSON object with name, start, end times, location, and find a description. Only provide the exact location for the event. If there are multiple events, put the events in order. Start and End times should be represented in ISO-6801 format with time zone based on location found above if possible, else default to user location's time zone. If that isn't available, then set it to Eastern Daylight Time. Only present me with the JSON with no other text. There should also only be five fields: name, start, end, location, and description fields in this JSON."

    const eventsResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: EVENTS_PROMPT },
                    { type: "image_url", image_url: { "url": encoded_image } },
                ],
            },
        ],
        max_tokens: 1024,
    }).asResponse();
    const eventsResponseJson = await eventsResponse.json()
    let eventsStr = eventsResponseJson.choices[0].message.content
    eventsStr = eventsStr.substring(7, eventsStr.length - 3)
    let eventsJson = JSON.parse(eventsStr)

    const events = parseEvents(eventsJson)

    return events
}