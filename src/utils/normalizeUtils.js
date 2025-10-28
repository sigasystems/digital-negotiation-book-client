import { resolveField } from "@/utils/fieldMapper";

/** Utility to normalize keys to snake_case for comparison */
export const normalizeKey = (key) =>
  key
    ?.replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    ?.replace(/__/g, "_")
    ?.toLowerCase();

/** Checks if a key is part of hidden fields */
export const isHidden = (key, hiddenFields = []) =>
  hiddenFields.map((f) => f.toLowerCase()).includes(key.toLowerCase());

/** Removes hidden fields from a record */
export const sanitizeData = (data = {}, hiddenFields = []) => {
  return Object.fromEntries(
    Object.entries(data).filter(([k]) => !isHidden(k, hiddenFields))
  );
};

/** ✅ Normalizes API → UI data using resolveField */
export const normalizeData = (data, roleType, config, hiddenFields = []) => {
  if (!data || !roleType || !config) return {};

  const map = config[roleType]?.API_TO_UI || {};
  const resolved = resolveField(data, map);
  return sanitizeData(resolved, hiddenFields);
};

/** ✅ Converts UI → API keys for update/create */
export const denormalizeData = (data, roleType, config, hiddenFields = []) => {
  if (!data || !roleType || !config) return {};

  const map = config[roleType]?.UI_TO_API || {};
  const result = {};

  for (const [key, val] of Object.entries(data)) {
    if (val === undefined || val === null || val === "") continue;
    if (isHidden(key, hiddenFields)) continue;

    const normalizedKey = normalizeKey(key);
    const apiKey =
      map[key] ||
      map[normalizedKey] ||
      Object.keys(map).find(
        (mappedKey) => normalizeKey(mappedKey) === normalizedKey
      ) ||
      normalizedKey;

    result[apiKey] = val;
  }
  
  return result;
};
