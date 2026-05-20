import { Button, Form, Input, Select, Typography } from "antd";
import type { FormInstance } from "antd";
import { Globe, House, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { countryOptions, getCountryLabel } from "../../../utils/countryOptions";
import type { ProfileFormValues } from "../../../types/profileFormTypes";

const { Text } = Typography;

const fieldLabel = (text: string) => (
  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
    {text}
  </span>
);
const addressLineKeys = [
  "address1",
  "address2",
  "address3",
  "address4",
  "address5",
  "address6",
  "address7",
] as const;

type ReadonlyDetailRowProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

const ReadonlyDetailRow = ({ icon, label, value }: ReadonlyDetailRowProps) => (
  <div className="flex items-start gap-3">
    <span className="pt-0.5 text-slate-400">{icon}</span>
    <div className="min-w-0">
      <Text className="font-medium! text-slate-500!">{label}</Text>
      <div className="mt-1">
        <Text className="break-all text-slate-900!">{value}</Text>
      </div>
    </div>
  </div>
);

type AddressEditorProps = {
  form: FormInstance<ProfileFormValues>;
  isEditing: boolean;
};

const AddressEditor = ({ form, isEditing }: AddressEditorProps) => {
  const values = Form.useWatch([], form) as
    | Partial<ProfileFormValues>
    | undefined;
  const [visibleAddressLines, setVisibleAddressLines] = useState(1);

  const addressLineValues = addressLineKeys.map(
    (key) => (values?.[key] ?? form.getFieldValue(key)) || "",
  );
  const highestFilledAddressLine = Math.max(
    1,
    ...addressLineValues.map((value, index) =>
      typeof value === "string" && value.trim() !== "" ? index + 1 : 0,
    ),
  );

  useEffect(() => {
    if (!isEditing) {
      setVisibleAddressLines(1);
      return;
    }

    setVisibleAddressLines(highestFilledAddressLine);
  }, [highestFilledAddressLine, isEditing]);

  const canAddAddressLine =
    Boolean(values?.address1?.trim()) &&
    visibleAddressLines < addressLineKeys.length;
  const addressSummary = addressLineValues
    .filter((value) => typeof value === "string" && value.trim() !== "")
    .join(", ");
  const countryCode = (
    values?.country_code ?? form.getFieldValue("country_code")
  )?.toUpperCase();
  const countryLabel = getCountryLabel(countryCode);
  const cityZipValue = [
    values?.city ?? form.getFieldValue("city"),
    values?.zip ?? form.getFieldValue("zip"),
  ]
    .filter((value) => typeof value === "string" && value.trim() !== "")
    .join(", ");

  if (!isEditing) {
    return (
      <div className="mt-4 space-y-3">
        <ReadonlyDetailRow
          icon={<Globe size={18} />}
          label="Country"
          value={
            countryLabel
              ? `${countryLabel}${countryCode ? ` (${countryCode})` : ""}`
              : countryCode || "Not specified"
          }
        />
        <ReadonlyDetailRow
          icon={<House size={18} />}
          label="Street"
          value={addressSummary || "No street address provided"}
        />
        {cityZipValue ? (
          <ReadonlyDetailRow
            icon={<House size={18} />}
            label="City / ZIP"
            value={cityZipValue}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Form.Item
          label={fieldLabel("Country")}
          name="country_code"
          rules={[{ required: true, message: "Select a country" }]}
          className="mb-0!"
        >
          <Select
            showSearch
            options={countryOptions}
            optionFilterProp="label"
            className="w-full rounded-xl! "
            size="middle"
          />
        </Form.Item>

        <Form.Item label={fieldLabel("ZIP")} name="zip" className="mb-0!">
          <Input size="middle" className="rounded-xl!" />
        </Form.Item>

        <Form.Item label={fieldLabel("City")} name="city" className="mb-0! ">
          <Input size="middle" className="rounded-xl!" />
        </Form.Item>

        <Form.Item
          label={fieldLabel("Address Line 1")}
          name="address1"
          className="mb-0! sm:col-span-2"
        >
          <Input size="middle" className="rounded-xl!" />
        </Form.Item>

        {addressLineKeys
          .slice(1, visibleAddressLines)
          .map((fieldKey, index) => (
            <Form.Item
              key={fieldKey}
              label={fieldLabel(`Address Line ${index + 2}`)}
              name={fieldKey}
              className="mb-0! sm:col-span-2"
            >
              <Input size="middle" className="rounded-xl!" />
            </Form.Item>
          ))}
      </div>

      {canAddAddressLine ? (
        <Button
          icon={<Plus size={14} />}
          onClick={() =>
            setVisibleAddressLines((currentValue) =>
              Math.min(currentValue + 1, addressLineKeys.length),
            )
          }
          className="rounded-xl! hover:border-cyan-700! hover:text-cyan-800!"
        >
          Add address line
        </Button>
      ) : null}
    </div>
  );
};

export default AddressEditor;
