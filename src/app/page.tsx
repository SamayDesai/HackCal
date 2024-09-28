import Image from "next/image";
import { InitApiCall, ProcessImageRequest, TestApiCall, TestProcessImageRequest } from "./ocr/api";

export default async function Home() {

  // let openai = await InitApiCall()
  // let test_call = await TestApiCall(openai)
  // let info = await ProcessImageRequest(openai, `./public/examples/Image from i.pinimg.com.jpg`);
  let events = await TestProcessImageRequest()

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
