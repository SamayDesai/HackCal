import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import Tesseract from 'tesseract.js';
import { parseEvents } from '@/app/models'; // Adjust the path as needed

export async function POST(req: NextRequest) {
  try {
    const { base64File } = await req.json();

    // Remove data URL prefix if present
    const base64Data = base64File.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

    // Convert base64 to Buffer
    const imgBuffer = Buffer.from(base64Data, 'base64');

    // Use Tesseract.js to extract text from the image
    const {
      data: { text },
    } = await Tesseract.recognize(imgBuffer, 'eng');

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Prepare the prompt with the extracted text
    const EVENTS_PROMPT = `Extract event information from the following text:\n\n${text}\n\nCollect all event names and their associated start and end times. Store this in a JSON format with each event being represented as a JSON object with name, start, end times, location, and find a description. Only provide the exact location for the event. If there are multiple events, put the events in order. Start and End times should be represented in ISO-6801 format with time zone based on location found above if possible, else default to user location's time zone. If that isn't available, then set it to Eastern Daylight Time. Only present me with the JSON with no other text. There should also only be five fields: name, start, end, location, and description fields in this JSON.`;

    try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'user',
              content: EVENTS_PROMPT,
            },
          ],
          max_tokens: 1024,
        });
      
        const content = response.choices?.[0]?.message?.content?.trim();
      
        if (content) {
          // Parse the JSON output from OpenAI
          const eventsJson = JSON.parse(content);
      
          // Optionally parse events into your Event type
          const events = parseEvents(eventsJson);
      
          return NextResponse.json({ events });
        } else {
          console.error('No content in the response message.');
          return NextResponse.json(
            { error: 'No content in the response message.' },
            { status: 500 }
          );
        }
      } catch (error: any) {
        console.error('Error processing image:', error);
        return NextResponse.json(
          { error: 'Failed to process image', details: error.message },
          { status: 500 }
        );
      }
  } catch (error: any) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image', details: error.message },
      { status: 500 }
    );
  }
}