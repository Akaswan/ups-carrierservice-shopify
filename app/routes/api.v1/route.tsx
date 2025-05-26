import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import getRating from "./getrating";

type ServiceMap = {
  [key: string]: string;
};

type Rate = {
  service_name: string;
  service_code: string;
  total_price: string;
  description: string;
  currency: string;
  min_delivery_date: string;
  max_delivery_date: string;
};

const serviceMap: ServiceMap = {
  "01": "Next Day Air",
  "02": "2nd Day Air",
  "03": "Ground"
};

var price_cap = 499;

var percentage = .10;

const calculateSubtotal = (body: any): number => {

    var items = body.rate.items;

    var subtotal = 0;

    for (var i = 0; i < items.length; i++) {
        subtotal += items[i].price * items[i].quantity;
    }

  return subtotal / 100;
}

const handleUPS = async (body: any) => {

  var items = body.rate.items;

  const response: { rates: Rate[] } = {
    rates: [],
  };

  for (const key in serviceMap) {
    var price = 0;

    for (var i = 0; i < items.length; i++) {
      const rating: any = await getRating(body, items[i], key);

      price += rating.RateResponse.RatedShipment.TotalCharges.MonetaryValue * items[i].quantity;
    }

    var newRate: Rate =   
        {
          service_name: serviceMap[key],
          service_code: key,
          total_price: (price * 100).toString(),
          description: "",
          currency: "USD",
          min_delivery_date: "2024-07-17 14:48:45 -0400",
          max_delivery_date: "2024-07-18 14:48:45 -0400",
        };

    response.rates.push(newRate);
  }

  return response;
}


const handlePercentage = async (subtotal: number) => {
  const shipping = subtotal * percentage;

  return {
    rates:  [
      {
        service_name: "Shipping",
        service_code: "WI",
        total_price: shipping.toString(),
        description: "",
        currency: "USD",
        min_delivery_date: "2024-07-17 14:48:45 -0400",
        max_delivery_date: "2024-07-18 14:48:45 -0400",
      }
    ],
  };
}

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const body = await request.json();
  // return handleUPS(body);

  // const subtotal = calculateSubtotal(body);

  // console.log(new Date());

  var response;

  // if (subtotal < price_cap) {
    response = await handleUPS(body);
  // } else {
  //   response = await handlePercentage(subtotal);
  // }

  return json(response, { status: 200 });
};

export const loader: LoaderFunction = () => {
  return new Response("Method Not Allowed", { status: 405 });
};

/*
ngrok http --domain=rooster-flexible-bug.ngrok-free.app 64120
*/
