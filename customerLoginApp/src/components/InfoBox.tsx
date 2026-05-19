import { Form, Input, Select } from "antd";
import type { FormItemProps, InputProps, SelectProps } from "antd";
import type { ReactNode } from "react";

type EditFieldType = "input" | "date" | "select";

type InfoBoxProps = {
  label: string;
  value: string | number | null | undefined;
  isEditing?: boolean;
  formItemProps?: FormItemProps;
  editFieldType?: EditFieldType;
  inputProps?: InputProps;
  selectProps?: SelectProps;
  breakAll?: boolean;
  noWrap?: boolean;
  variant?: "default" | "secondary";
  trailing?: ReactNode;
};

const compactInputClassName =
  "rounded-xl! px-3! py-2! text-sm! min-h-[38px]! shadow-none!";

const renderEditControl = (
  editFieldType: EditFieldType,
  inputProps?: InputProps,
  selectProps?: SelectProps,
) => {
  if (editFieldType === "select") {
    return <Select {...selectProps} className="w-full" size="middle" />;
  }

  if (editFieldType === "date") {
    return (
      <Input
        {...inputProps}
        type="date"
        size="middle"
        className={compactInputClassName}
      />
    );
  }

  return (
    <Input
      {...inputProps}
      size="middle"
      className={compactInputClassName}
    />
  );
};

const InfoBox = ({
  label,
  value,
  isEditing = false,
  formItemProps,
  editFieldType = "input",
  inputProps,
  selectProps,
  breakAll = false,
  noWrap = false,
  variant = "default",
  trailing,
}: InfoBoxProps) => {
  const displayValue =
    value === null || value === undefined || value === ""
      ? "Not specified"
      : value;
  const containerClassName =
    variant === "secondary"
      ? "rounded-xl"
      : "rounded-xl bg-blue-50 px-3 py-2.5";

  return (
    <div className={containerClassName}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            {label}
          </p>
          {isEditing && formItemProps ? (
            <div className="mt-2">
              <Form.Item {...formItemProps}>
                {renderEditControl(editFieldType, inputProps, selectProps)}
              </Form.Item>
            </div>
          ) : (
            <p
              className={`mt-1 overflow-x-auto text-sm leading-5 text-slate-700 ${breakAll ? "break-all" : ""} ${noWrap ? "whitespace-nowrap" : ""}`}
            >
              {displayValue}
            </p>
          )}
        </div>
        {trailing}
      </div>
    </div>
  );
};

export default InfoBox;
