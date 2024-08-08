export async function getPostcodes(
  postcode: string
): Promise<[User: string[] | null, Error: Error | null]> {
  try {
    const response = await fetch(
      `https://api.postcodes.io/postcodes/${postcode}/autocomplete`
    );
    if (!response.ok) {
      return [null, new Error("Failed to fetch postcodes")];
    }
    const data = await response.json();
    return [data.result, null];
  } catch (error) {
    return [null, error as Error];
  }
}
