import { Button } from "antd";
import { LogOut, MapPin, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import InfoBox from "./InfoBox";

const formatAgreementValue = (value: number) => {
  if (value === 1) {
    return "Yes";
  }

  if (value === 2) {
    return "No";
  }

  return String(value);
};

const getAddressLines = (address: {
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
}) => {
  const lines = [
    address.address1,
    address.address2,
    address.address3,
    address.address4,
    address.address5,
    address.address6,
    address.address7,
    [address.zip, address.city].filter(Boolean).join(" ").trim(),
    address.country_code?.toUpperCase(),
  ].filter((line) => Boolean(line && line.trim()));

  return lines.length > 0 ? lines : ["Not specified"];
};

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <main className="relative flex min-h-screen items-center justify-center px-4 py-8">
        <section className="w-full max-w-md rounded-[28px] border border-white/70 bg-white/90 p-7 text-center shadow-[0_28px_90px_rgba(15,23,42,0.16)] backdrop-blur md:p-9">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-700">
            Profile
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            No user data
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            User details are not available yet.
          </p>
        </section>
      </main>
    );
  }

  const { customer_id, last_change, personal_information, state } = user;
  const { address, agreement } = personal_information;
  const addressLines = getAddressLines(address);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <main className="relative min-h-screen bg-blue-50 px-4 py-5 md:py-6">
      <div className="mx-auto w-full max-w-6xl space-y-4">
        <section className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-[0_20px_70px_rgba(15,23,42,0.14)] backdrop-blur md:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-cyan-700">
                  Profile
                </p>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                  {personal_information.first_name}{" "}
                  {personal_information.last_name}
                </h1>
                <p className="mt-1.5 text-sm leading-5 text-slate-500">
                  Customer profile loaded from the customer interface.
                </p>
              </div>

              <div className="flex flex-wrap justify-end gap-2 self-start sm:self-auto">
                <Button
                  type="default"
                  icon={<Pencil size={16} />}
                  className="h-11! rounded-2xl! border-slate-200! bg-white! px-4! font-medium! text-slate-700! shadow-none!"
                >
                  Edit
                </Button>
                <Button
                  type="primary"
                  danger
                  icon={<LogOut size={16} />}
                  onClick={handleLogout}
                  className="h-11! rounded-2xl! border-0! bg-slate-950! px-4! font-semibold! text-white! hover:bg-rose-700!"
                >
                  Logout
                </Button>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 px-4 py-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 text-slate-700" />
                <div>
                  <h3 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Address
                  </h3>
                  <div className="mt-2 space-y-1 text-sm leading-5 text-slate-700">
                    {addressLines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-[0_20px_70px_rgba(15,23,42,0.14)] backdrop-blur md:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-slate-950">
                  Personal Information
                </h2>
                <p className="text-sm text-slate-500">
                  Primary customer details first. System identifiers stay secondary.
                </p>
              </div>
              <div className="inline-flex w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                State: {state}
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <InfoBox
                label="First Name"
                value={personal_information.first_name}
              />
              <InfoBox
                label="Last Name"
                value={personal_information.last_name}
              />
              <InfoBox
                label="Email"
                value={personal_information.email}
                breakAll
              />
              <InfoBox label="Phone" value={personal_information.phone} />
              <InfoBox
                label="Birthdate"
                value={personal_information.birthdate}
              />
              <InfoBox
                label="Gender"
                value={
                  personal_information.gender === 2
                    ? "Male"
                    : personal_information.gender === 1
                      ? "Female"
                      : "Not specified"
                }
              />
              <InfoBox
                label="Language"
                value={personal_information.language_id}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                System Details
              </h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <InfoBox label="Customer ID" value={customer_id} breakAll />
                <InfoBox label="Last Change" value={last_change} />
                <InfoBox
                  label="Store ID"
                  value={personal_information.store_id}
                  breakAll
                />
                <InfoBox
                  label="Country"
                  value={address.country_code?.toUpperCase()}
                />
              </div>
            </div>
          </section>

          <aside className="xl:sticky xl:top-6 xl:self-start">
            <section className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-[0_20px_70px_rgba(15,23,42,0.14)] backdrop-blur md:p-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Agreements
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Compact consent overview.
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2.5">
                  <span className="text-sm font-medium text-slate-700">GTC</span>
                  <span className="text-sm font-semibold text-slate-950">
                    {formatAgreementValue(agreement.agreement_gtc)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2.5">
                  <span className="text-sm font-medium text-slate-700">
                    Profiling
                  </span>
                  <span className="text-sm font-semibold text-slate-950">
                    {formatAgreementValue(agreement.agreement_profiling)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2.5">
                  <span className="text-sm font-medium text-slate-700">
                    Marketing
                  </span>
                  <span className="text-sm font-semibold text-slate-950">
                    {formatAgreementValue(
                      agreement.agreement_marketing_communication,
                    )}
                  </span>
                </div>
              </div>

              <div className="mt-5">
                <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Custom Agreements
                </h3>
                <div className="mt-3 space-y-2">
                  {agreement.custom_agreements.map((item) => (
                    <div
                      key={item.agreement_id}
                      className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                            Agreement ID
                          </p>
                          <p className="mt-1 break-all text-xs leading-5 text-slate-600">
                            {item.agreement_id}
                          </p>
                        </div>
                        <span className="whitespace-nowrap rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800">
                          {formatAgreementValue(item.agreement_value)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
