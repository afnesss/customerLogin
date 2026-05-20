import dayjs from "dayjs";
import { parsePhoneNumberWithError } from "libphonenumber-js";

export const formatAgreementValue = (value: number) => {
  if (value === 1) {
    return "Yes";
  }

  if (value === 2) {
    return "No";
  }

  return String(value);
};

export const formatGenderValue = (value: number) => {
  if (value === 2) {
    return "Female";
  }

  if (value === 1) {
    return "Male";
  }

  return "Not specified";
};

export const formatPhone = (
  value: string | null | undefined,
): string | null => {
  if (!value?.trim()) return null;
  try {
    return parsePhoneNumberWithError(value).formatInternational();
  } catch {
    return value;
  }
};

export const formatLanguage = (
  value: string | null | undefined,
): string | null => {
  if (!value?.trim()) return null;
  try {
    return (
      new Intl.DisplayNames(["en"], { type: "language" }).of(value) ?? value
    );
  } catch {
    return value;
  }
};

export const formatDate = (value: string | null | undefined): string | null => {
  if (!value) return null;
  const date = dayjs(value);
  if (!date.isValid()) return value;
  return date.format("MMM D, YYYY");
};
