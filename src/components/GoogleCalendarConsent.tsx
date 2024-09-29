/**
 * @fileoverview related to firebase-google login integration.
 * This file primarily concerns google integration, popup management, and google login. 
 */
import { useEffect } from "react";
import { google } from "googleapis"; // OR https://accounts.google.com/gsi/client

export const GoogleCalendarConsent = () => {
  useEffect(() => {
    const client = google.accounts.oauth2.initCodeClient({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      scope: "https://www.googleapis.com/auth/calendar.readonly",
      access_type: "offline",
      ux_mode: "popup",
      callback: (response: any) => {
        console.log("Code:", response.code);
        // Send this code to your backend for token exchange
      },
    });
    client.requestCode();
  }, []);

  return <button onClick={() => {}}>Connect to Google Calendar</button>;
};
