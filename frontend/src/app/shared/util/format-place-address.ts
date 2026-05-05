/**
 * Build a user-facing address string from a Google Places Autocomplete result.
 *
 * For a POI like `將軍澳醫院` Google returns `name = "將軍澳醫院"` and
 * `formatted_address = "將軍澳寶寧里2號"` separately. The default behaviour of
 * `google.maps.places.Autocomplete` is to write `formatted_address` back into
 * the input, which hides the POI name the user just searched for.
 *
 * We preserve both: `"將軍澳醫院, 將軍澳寶寧里2號"` (matches Google's own
 * "primary / secondary" prediction layout). For pure street-address results
 * where `name` is essentially the same as the address, we fall back to the
 * formatted address alone so the string doesn't become redundant.
 */
export function formatPlaceDisplayAddress(
  place: google.maps.places.PlaceResult,
): string | null {
  const name = place.name?.trim() || null;
  const formatted = place.formatted_address?.trim() || null;

  if (name && formatted) {
    const nameLower = name.toLowerCase();
    const formattedLower = formatted.toLowerCase();
    const looksLikeAddressName =
      formattedLower === nameLower || formattedLower.startsWith(`${nameLower} `) || formattedLower.startsWith(`${nameLower},`);
    if (!looksLikeAddressName) {
      return `${name}, ${formatted}`;
    }
  }

  return formatted ?? name;
}
