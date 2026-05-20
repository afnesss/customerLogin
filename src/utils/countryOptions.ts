import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

export const countryOptions = Object.entries(
  countries.getNames("en", { select: "official" }),
)
  .filter(([, label]) => Boolean(label))
  .map(([value, label]) => ({
    label,
    value,
  }))
  .sort((left, right) => left.label.localeCompare(right.label));

export const getCountryLabel = (countryCode?: string | null) => {
  if (!countryCode) {
    return null;
  }

  return countries.getName(countryCode, "en", { select: "official" }) ?? null;
};
