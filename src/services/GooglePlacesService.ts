const GOOGLE_API_KEY = "AIzaSyDIFjl367DpdMmBtzIBruKgjP00sh8HAaU";

export async function searchPlaces(text: string) {
  if (text.trim().length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      "https://places.googleapis.com/v1/places:autocomplete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_API_KEY,
          "X-Goog-FieldMask":
            "suggestions.placePrediction.place,suggestions.placePrediction.text",
        },
        body: JSON.stringify({
          input: text,
          languageCode: "es",
          regionCode: "DO",
        }),
      }
    );

    if (!response.ok) {
      console.log(await response.text());
      return [];
    }

    const json = await response.json();

    return json.suggestions ?? [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getPlaceDetails(place: string) {
  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/${place}`,
      {
        method: "GET",
        headers: {
          "X-Goog-Api-Key": GOOGLE_API_KEY,
          "X-Goog-FieldMask":
            "id,displayName,formattedAddress,location",
        },
      }
    );

    if (!response.ok) {
      console.log(await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}