import { redirect } from '@remix-run/node';
import fetch from 'node-fetch';

export default async function getRating(body: any, item: any, serviceValue: string) {
  const query = new URLSearchParams({
    additionalinfo: ''
  }).toString();

  const origin = body.rate.origin;
  const destination = body.rate.destination;

  const version = 'v2403';
  const requestoption = 'Rate';
  const resp = await fetch(
    `https://wwwcie.ups.com/api/rating/${version}/${requestoption}?${query}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        transId: 'string',
        transactionSrc: 'testing',
        Authorization: 'Bearer '
      },
      body: JSON.stringify({
        RateRequest: {
          Request: {RequestOption: 'Rate'},
          Shipment: {
            Shipper: {
              Address: {
                AddressLine: [
                    origin.address1,
                    origin.address2,
                    origin.address3
                ],
                City: origin.city,
                StateProvinceCode: origin.province,
                PostalCode: origin.postal_code,
                CountryCode: origin.country
              }
            },
            ShipTo: {
              Address: {
                AddressLine: [
                  destination.address1,
                  destination.address2,
                  destination.address3
                ],
                City: destination.city,
                StateProvinceCode: destination.province,
                PostalCode: destination.postal_code,
                CountryCode: destination.country
              }
            },
            Service: {
              Code: serviceValue
            },
            Package: {
              PackagingType: {
                Code: '02',
                Description: 'Packaging'
              },
              Dimensions: {
                UnitOfMeasurement: {
                  Code: 'IN',
                  Description: 'Inches'
                },
                Length: '5',
                Width: '5',
                Height: '5'
              },
              PackageWeight: {
                UnitOfMeasurement: {
                  Code: 'LBS',
                  Description: 'Pounds'
                },
                Weight: (item.grams / 453.6).toString()
              }
            }
          }
        }
      })
    }
  );

  const data = await resp.json();

  return data;
}
