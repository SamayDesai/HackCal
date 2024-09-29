import { google } from "googleapis";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  // Load access token and refresh token from your database (e.g., Firestore)
  const accessToken = "user_access_token"; // Replace with token loading logic
  const refreshToken = "user_refresh_token"; // Replace with token loading logic

  const oAuth2Client = new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oAuth2Client.setCredentials({ access_token: accessToken, refresh_token: refreshToken });

  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

  try {
    const events = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });
    res.status(200).json(events.data.items);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
