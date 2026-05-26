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
function displayNameText(displayName: unknown): string | null {
  if (displayName == null) {
    return null;
  }
  if (typeof displayName === 'string') {
    const t = displayName.trim();
    return t || null;
  }
  const text = (displayName as { text?: string }).text;
  if (typeof text === 'string') {
    const t = text.trim();
    return t || null;
  }
  return null;
}

/**
 * Same POI / address merge rules as {@link formatPlaceDisplayAddress}, for the new
 * `google.maps.places.Place` type (after `fetchFields`).
 */
export function formatGooglePlaceDisplayAddress(place: {
  readonly displayName?: unknown;
  readonly formattedAddress?: string | null;
}): string | null {
  const name = displayNameText(place.displayName);
  const formatted = place.formattedAddress?.trim() || null;

  if (name && formatted) {
    const nameLower = name.toLowerCase();
    const formattedLower = formatted.toLowerCase();
    const looksLikeAddressName =
      formattedLower === nameLower ||
      formattedLower.startsWith(`${nameLower} `) ||
      formattedLower.startsWith(`${nameLower},`);
    if (!looksLikeAddressName) {
      return `${name}, ${formatted}`;
    }
  }

  return formatted ?? name;
}

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
