import { ActionFunction, LoaderFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader: LoaderFunction = async ({ request }) => {
  // const { admin, session } = await authenticate.admin(request);

  // const count = await admin.rest.resources.Metafield.count({
  //   session: session,
  //   product_id: 8596920893678,
  // });

  return json(request);
};
