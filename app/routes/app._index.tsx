import { useCallback, useEffect, useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
  TextField,
  RangeSlider,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import db from "../db.server";


export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  const { searchParams } = new URL(request.url);
  const shop = searchParams.get("shop");

  if (shop != null) {
    const session = await db.session.findFirst({
      where: {
        shop: shop,
      },
    });

    return session;
  }

  return null;
};

// export const action = async ({ request }: ActionFunctionArgs) => {
//     const { admin, session } = await authenticate.admin(request);
  
//     const carrier_service = new admin.rest.resources.CarrierService({session: session});
  
//     carrier_service.name = "Custom Ari Provider";
//     carrier_service.callback_url = "https://rooster-flexible-bug.ngrok-free.app/api/v1";
//     carrier_service.service_discovery = true;
//     await carrier_service.save({
//       update: true,
//     });

//     return carrier_service.toJSON();
// }

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const entries = Object.fromEntries(formData) as { [key: string]: string };

  const { searchParams } = new URL(request.url);
  const shop = searchParams.get("shop");

  const calcThreshold = parseFloat(entries.calculationThreshold);
  const shippingMultiplier = parseFloat(entries.shippingMultiplier) / 100;

  // console.log(calcThreshold, shippingMultiplier);

  // console.log(request);

  if (shop != null) {
    await db.session.update({
      where: {
        shop: shop,
      },
      data: {
        amountLimit: calcThreshold,
        percentage: shippingMultiplier
      }
    });
  }

  return null;
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  const [calcThreshold, setCalcThreshold] = useState(data?.amountLimit.toString());

  const [shippingPercentage, setShippingPercentage] = useState(data?.percentage! * 100);

  const handleRangeSliderChange = useCallback(
    (value: number) => setShippingPercentage(value),
    [],
  );

  const handleChange = useCallback(
    async (newValue: string) => {
      
      setCalcThreshold(newValue)},
    [],
  );

  const fetcher = useFetcher<typeof action>();

  const installCarrier = () => fetcher.submit({}, { method: "POST" });

  const submitDoc = () => {
    // You can manually trigger the form submission
    if (document.getElementById('update-calculation') != null) {
      document.getElementById('update-calculation')!.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  return (
    <Page>
      <TitleBar title="Ari App">
        <button variant="primary" onClick={installCarrier}>
          Install our Carrier
        </button>
      </TitleBar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Edit your carrier settings
                  </Text>
                <Form method="post" id="update-calculation">
                  <BlockStack gap="400">
                    <TextField
                      label="Calculation Threshold"
                      type="number"
                      name="calculationThreshold"
                      value={calcThreshold}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                    <RangeSlider
                      label="Shipping Multiplier"
                      id="shippingMultiplier"
                      value={shippingPercentage}
                      onChange={handleRangeSliderChange}
                      output
                    />
                    <InlineStack align="end">
                      <Button variant="primary" onClick={submitDoc}>
                        Save Changes
                      </Button>
                    </InlineStack>
                    </BlockStack>
                  </Form>
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    App template specs
                  </Text>
                  <BlockStack gap="200">
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Framework
                      </Text>
                      <Link
                        url="https://remix.run"
                        target="_blank"
                        removeUnderline
                      >
                        Remix
                      </Link>
                    </InlineStack>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Database
                      </Text>
                      <Link
                        url="https://www.prisma.io/"
                        target="_blank"
                        removeUnderline
                      >
                        Prisma
                      </Link>
                    </InlineStack>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Interface
                      </Text>
                      <span>
                        <Link
                          url="https://polaris.shopify.com"
                          target="_blank"
                          removeUnderline
                        >
                          Polaris
                        </Link>
                        {", "}
                        <Link
                          url="https://shopify.dev/docs/apps/tools/app-bridge"
                          target="_blank"
                          removeUnderline
                        >
                          App Bridge
                        </Link>
                      </span>
                    </InlineStack>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        API
                      </Text>
                      <Link
                        url="https://shopify.dev/docs/api/admin-graphql"
                        target="_blank"
                        removeUnderline
                      >
                        GraphQL API
                      </Link>
                    </InlineStack>
                  </BlockStack>
                </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Next steps
                  </Text>
                  <List>
                    <List.Item>
                      Build an{" "}
                      <Link
                        url="https://shopify.dev/docs/apps/getting-started/build-app-example"
                        target="_blank"
                        removeUnderline
                      >
                        {" "}
                        example app
                      </Link>{" "}
                      to get started
                    </List.Item>
                    <List.Item>
                      Explore Shopify’s API with{" "}
                      <Link
                        url="https://shopify.dev/docs/apps/tools/graphiql-admin-api"
                        target="_blank"
                        removeUnderline
                      >
                        GraphiQL
                      </Link>
                    </List.Item>
                  </List>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
