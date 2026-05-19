import { Button, Card, Form, Space, Tag, Typography } from "antd";
import type { FormInstance } from "antd";
import { Pencil, X } from "lucide-react";
import type { CustomerPersonalInformation } from "../../../types/customerDto";
import {
  renderInfoBoxGrid,
  type ProfileFieldConfig,
} from "./profileSectionShared";

const { Paragraph, Title } = Typography;

type PersonalInformationSectionProps = {
  cardClassName: string;
  personalForm: FormInstance;
  personalFields: ProfileFieldConfig<CustomerPersonalInformation>[];
  isEditingPersonal: boolean;
  isSavingPersonal: boolean;
  state: number;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (values: any) => Promise<void>;
};

const PersonalInformationSection = ({
  cardClassName,
  personalForm,
  personalFields,
  isEditingPersonal,
  isSavingPersonal,
  state,
  onEdit,
  onCancel,
  onSave,
}: PersonalInformationSectionProps) => (
  <Card className={`${cardClassName} h-full! w-full`}>
    <Space orientation="vertical" size={15} className="w-full">
      <div className="flex flex-col">
        <div className="flex flex-row items-center justify-between gap-3">
          <Title level={4} className="mb-1! text-slate-950!">
            Personal Information
          </Title>
          <div className="flex items-center gap-3">
            <Tag
              color="green"
              className="m-0! w-fit! rounded-full px-3 py-2 text-xs!"
            >
              State: {state}
            </Tag>
            {!isEditingPersonal ? (
              <Button
                icon={<Pencil size={14} />}
                onClick={onEdit}
                className="rounded-xl!"
              >
                Edit
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <Form form={personalForm} layout="vertical" onFinish={onSave}>
        {renderInfoBoxGrid(personalFields, isEditingPersonal)}

        {isEditingPersonal ? (
          <Space className="mt-4">
            <Button
              type="primary"
              htmlType="submit"
              loading={isSavingPersonal}
              className="rounded-xl!"
            >
              Save changes
            </Button>
            <Button
              icon={<X size={14} />}
              onClick={onCancel}
              className="rounded-xl!"
            >
              Cancel
            </Button>
          </Space>
        ) : null}
      </Form>
    </Space>
  </Card>
);

export default PersonalInformationSection;
