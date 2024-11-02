'use server'

import{ jwtDecode } from "jwt-decode";

import { JwtPayload } from "jwt-decode";

interface UpdatedPayload extends JwtPayload {
  email?: string;
}

export default async function GetUserInfo(auth_code: string) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code: auth_code,
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
      client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET!,
      redirect_uri: "http://localhost:3000",
      grant_type: 'authorization_code',
    }),
  });

  const tokenJson = await response.json();
  console.log(tokenJson);
  console.log('tokenid:' + tokenJson.id_token);

  const jwtDecoded = jwtDecode<UpdatedPayload>(tokenJson.id_token);

  const userId = jwtDecoded.sub;
  const email = jwtDecoded.email;

  return { userId, email };
}