import Image from "next/image";
import { InitApiCall, ProcessImageRequest, TestApiCall } from "./ocr/api";

export default async function Home() {

  let openai = await InitApiCall()
  // let test_call = await TestApiCall(openai)
  // let info = await ProcessImageRequest(openai, `./public/examples/IEEE%20Webinar.jpeg`);

  return (
    <div>
      <h1>HackCal!</h1>
    </div>
  );
}
