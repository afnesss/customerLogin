import { Button, Card, Form, Space, Typography } from "antd";
import type { FormInstance } from "antd";
import { LogOut, Pencil, X } from "lucide-react";
import type { CustomerAddress } from "../../../types/customerDto";
import {
  renderInfoBoxGrid,
  type ProfileFieldConfig,
} from "./profileSectionShared";

const { Paragraph, Text, Title } = Typography;

type ProfileHeaderCardProps = {
  cardClassName: string;
  personalName: string;
  addressForm: FormInstance<CustomerAddress>;
  addressFields: ProfileFieldConfig<CustomerAddress>[];
  isEditingAddress: boolean;
  isSavingAddress: boolean;
  onEditAddress: () => void;
  onCancelAddress: () => void;
  onSaveAddress: (values: CustomerAddress) => Promise<void>;
  onLogout: () => void;
};

const ProfileHeaderCard = ({
  cardClassName,
  personalName,
  addressForm,
  addressFields,
  isEditingAddress,
  isSavingAddress,
  onEditAddress,
  onCancelAddress,
  onSaveAddress,
  onLogout,
}: ProfileHeaderCardProps) => (
  <Card className={cardClassName}>
    <Space orientation="vertical" size={24} className="w-full">
      <div className="flex flex-col">
        <div className="flex flex-row items-start justify-between gap-3">
          <div>
            <Text className="text-xs! font-medium! uppercase text-cyan-700!">
              Profile
            </Text>
            <Title level={2} className="mt-2! mb-0! text-slate-950!">
              {personalName}
            </Title>
          </div>
          <Button
            type="primary"
            danger
            icon={<LogOut size={16} />}
            size="large"
            onClick={onLogout}
            className="rounded-2xl! bg-slate-900! hover:bg-red-900!"
          >
            Logout
          </Button>
        </div>
      </div>

      <Card
        size="small"
        title="Address"
        className="rounded-2xl! bg-slate-50!"
        variant="borderless"
        extra={
          !isEditingAddress ? (
            <Button
              icon={<Pencil size={14} />}
              onClick={onEditAddress}
              className="rounded-xl!"
            >
              Edit address
            </Button>
          ) : null
        }
      >
        <Form form={addressForm} layout="vertical" onFinish={onSaveAddress}>
          {renderInfoBoxGrid(addressFields, isEditingAddress)}

          {isEditingAddress ? (
            <Space className="mt-4">
              <Button
                type="primary"
                htmlType="submit"
                loading={isSavingAddress}
                className="rounded-xl!"
              >
                Save changes
              </Button>
              <Button
                icon={<X size={14} />}
                onClick={onCancelAddress}
                className="rounded-xl!"
              >
                Cancel
              </Button>
            </Space>
          ) : null}
        </Form>
      </Card>
    </Space>
  </Card>
);

export default ProfileHeaderCard;
