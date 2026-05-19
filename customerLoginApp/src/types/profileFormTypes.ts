import type {
  CustomerAddress,
  CustomerPersonalInformation,
} from "./customerDto";

export type PersonalInfoFormValues = Pick<
  CustomerPersonalInformation,
  | "pre_nominals"
  | "first_name"
  | "last_name"
  | "post_nominals"
  | "salutation"
  | "email"
  | "phone"
  | "birthdate"
  | "gender"
  | "language_id"
  | "photo_url"
>;

export type ProfileFormValues = PersonalInfoFormValues & CustomerAddress;
