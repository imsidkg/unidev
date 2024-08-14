// /pages/api/fetch-gmail.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { accessToken } = req.body;

        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken });

        const gmail = google.gmail({ version: 'v1', auth });

        const response = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 10, // Adjust as needed
        });

        const messages = response.data.messages || [];

        const emails = await Promise.all(
            messages.map(async (message) => {
                const msg = await gmail.users.messages.get({
                    userId: 'me',
                    id: message.id!,
                });
                return msg.data;
            })
        );

        res.status(200).json(emails);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Gmail emails' });
    }
}
