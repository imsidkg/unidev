import axios from "axios";

export async function fetchOutlookEmails(accessToken: string) {
    const response = await axios.get('https://graph.microsoft.com/v1.0/me/messages', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data.value; // Array of email objects
}
