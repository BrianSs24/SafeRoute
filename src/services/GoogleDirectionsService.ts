import * as polyline from "@mapbox/polyline";

const GOOGLE_API_KEY = "AIzaSyDIFjl367DpdMmBtzIBruKgjP00sh8HAaU";

export async function getRoute(
  origin: {
    latitude: number;
    longitude: number;
  },
  destination: {
    latitude: number;
    longitude: number;
  }
) {
  try {
    const response = await fetch(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_API_KEY,
          "X-Goog-FieldMask":
            "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline",
        },
        body: JSON.stringify({
          origin: {
            location: {
              latLng: {
                latitude: origin.latitude,
                longitude: origin.longitude,
              },
            },
          },

          destination: {
            location: {
              latLng: {
                latitude: destination.latitude,
                longitude: destination.longitude,
              },
            },
          },

          travelMode: "DRIVE",

          routingPreference: "TRAFFIC_AWARE",

          polylineEncoding: "ENCODED_POLYLINE",
        }),
      }
    );

    const json = await response.json();

    if (!json.routes?.length) {
      return null;
    }

    const encoded =
      json.routes[0].polyline.encodedPolyline;

    const decoded = polyline.decode(encoded);

    const coordinates = decoded.map((point) => ({
      latitude: point[0],
      longitude: point[1],
    }));

    return {
      coordinates,
      distance:
        json.routes[0].distanceMeters,
      duration:
        json.routes[0].duration,
    };

  } catch (error) {

    console.log(error);

    return null;

  }
}