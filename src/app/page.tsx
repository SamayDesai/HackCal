import Image from "next/image";
import { InitApiCall, TestApiCall } from "./ocr/api";

export default async function Home() {

  let openai = await InitApiCall()
  let test_call = await TestApiCall(openai)

  return (
    <div>

      {test_call.text()}

    </div>
  );
}
