export async function fetchPostcodes(postcode: string): Promise<string[]> {
  const response = await fetch(
    `https://api.postcodes.io/postcodes/${postcode}/autocomplete`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch postcode suggestions");
  }
  const data = await response.json();
  return data.result;
}
