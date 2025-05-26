import { json, LoaderFunction } from "@remix-run/node";
  export const loader: LoaderFunction = async ({ request }) => {
    const formData = {
      grant_type: 'client_credentials'
    };
  
    const resp = await fetch(
      `https://wwwcie.ups.com/security/v1/oauth/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-merchant-id': 'J57R54',
          Authorization: 'Basic ' + Buffer.from(`${process.env.UPS_CLIENT_ID}:${process.env.UPS_CLIENT_SECRET}`).toString('base64')
        },
        body: new URLSearchParams(formData).toString()
      }
    );
  
    const data: any = await resp.json();
    return data.access_token;
};
