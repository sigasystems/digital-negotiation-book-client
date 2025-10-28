// utils/fieldMapper.js
export const resolveField = (record, mapping) => {
  const result = {};

  for (const [apiKey, uiKey] of Object.entries(mapping)) {
    const variants = [
      apiKey,
      apiKey.toLowerCase(),
      apiKey.replace(/_/g, ""),
      uiKey,
      uiKey.toLowerCase(),
    ];

    for (const variant of variants) {
      if (record.hasOwnProperty(variant) && record[variant] != null) {
        result[uiKey] = record[variant];
        break;
      }
    }
  }

  return result;
};
