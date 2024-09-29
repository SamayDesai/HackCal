'use server'

import { FirebaseOptions } from "firebase/app"
import firebase from "firebase/compat/app";

import { jwtDecode } from "jwt-decode"

export default async function GetUserId(auth_code: string) {

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
        grant_type: 'authorization_code'
      }),
    })

    const tokenJson = await response.json()
    console.log(tokenJson)
    const jwtDecoded = jwtDecode(tokenJson.id_token)

    return jwtDecoded.sub

    // const { tokens } = await oauthClient.getToken(auth_code)
    // console.log(tokens)
    // return response.json().id
}