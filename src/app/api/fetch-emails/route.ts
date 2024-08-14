// /pages/api/fetch-emails.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { gmailToken, outlookToken } = req.body;

        const [gmailResponse, outlookResponse] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fetch-gmail/route`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accessToken: gmailToken }),
            }),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fetch-outlook`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accessToken: outlookToken }),
            }),
        ]);

        const gmailEmails = await gmailResponse.json();
        const outlookEmails = await outlookResponse.json();

        const allEmails = [...gmailEmails, ...outlookEmails];

        res.status(200).json(allEmails);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch emails' });
    }
}
