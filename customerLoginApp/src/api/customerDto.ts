export type CustomerAgreement = {
  agreement_id: string;
  agreement_value: number;
};

export type CustomerAddress = {
  address1: string;
  address2: string;
  address3: string;
  address4: string;
  address5: string;
  address6: string;
  address7: string;
  zip: string;
  city: string;
  country_code: string;
};

export type CustomerConsent = {
  agreement_gtc: number;
  agreement_profiling: number;
  agreement_marketing_communication: number;
  custom_agreements: CustomerAgreement[];
};

export type CustomerPersonalInformation = {
  gender: number;
  first_name: string;
  last_name: string;
  birthdate: string;
  email: string;
  phone: string;
  language_id: string;
  store_id: string;
  address: CustomerAddress;
  agreement: CustomerConsent;
  salutation: string;
};

export type User = {
  customer_id: string;
  personal_information: CustomerPersonalInformation;
  last_change: string;
  state: number;
};
