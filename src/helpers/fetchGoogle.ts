import { google } from 'googleapis';


export async function fetchGmailEmails(accessToken: string) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: 'v1', auth });

    const response = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 10, 
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

    return emails;
}