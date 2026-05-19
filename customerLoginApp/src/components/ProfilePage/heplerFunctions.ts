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
    return "Male";
  }

  if (value === 1) {
    return "Female";
  }

  return "Not specified";
};
