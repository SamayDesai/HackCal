import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import Tesseract from 'tesseract.js';
import { parseEvents } from '@/app/models'; // Adjust the path as needed
import { parseImageForEvents } from '@/app/openai';

export async function POST(req: NextRequest) {
  const json = await req.json();
  // const { base64File } = json;
  // Remove data URL prefix if present
  // const base64Data = json.file.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
  // // Convert base64 to Buffer
  // const imgBuffer = Buffer.from(base64Data, 'base64');
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  return NextResponse.json({ events: await parseImageForEvents(openai, json.file) })
}