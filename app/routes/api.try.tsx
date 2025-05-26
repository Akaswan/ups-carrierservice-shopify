import { json, LoaderFunction } from "@remix-run/node";
import db from "../db.server";

export const loader: LoaderFunction = async ({ request }) => {

    // await db.token.create({
    //     data: {
    //         id: "ups_access_token",
    //         token: 12345
    //     },
    // })

    await db.token.update({
        where: {
            id: "ups_access_token", // This specifies the record to update
        },
        data: {
            token: 67890, // This is the new data you want to update
        },
    });

    // console.log();

    return "Hi";
};
