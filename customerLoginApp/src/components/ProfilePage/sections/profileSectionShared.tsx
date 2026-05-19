import type { ReactNode } from "react";
import InfoBox from "../../InfoBox";

export type ProfileFieldConfig<TFormValues> = {
  label: string;
  value: string | number | null | undefined;
  formItemProps?: Parameters<typeof InfoBox>[0]["formItemProps"];
  editFieldType?: Parameters<typeof InfoBox>[0]["editFieldType"];
  selectProps?: Parameters<typeof InfoBox>[0]["selectProps"];
  breakAll?: boolean;
  noWrap?: boolean;
  variant?: Parameters<typeof InfoBox>[0]["variant"];
  trailing?: ReactNode;
  wrapperClassName?: string;
  key: Extract<keyof TFormValues, string> | string;
};

export const renderInfoBoxGrid = <TFormValues,>(
  fields: ProfileFieldConfig<TFormValues>[],
  isEditing = false,
) => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {fields.map((field) => (
      <div key={field.key} className={field.wrapperClassName}>
        <InfoBox
          label={field.label}
          value={field.value}
          isEditing={isEditing}
          formItemProps={field.formItemProps}
          editFieldType={field.editFieldType}
          selectProps={field.selectProps}
          breakAll={field.breakAll}
          noWrap={field.noWrap}
          variant={field.variant}
          trailing={field.trailing}
        />
      </div>
    ))}
  </div>
);
