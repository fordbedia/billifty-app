"use client";

import {useMemo} from "react";
import {isAxiosError} from "axios";
import {Alert, Button, Card, CardBody, Input, Switch} from "@heroui/react";
import SettingsSidebar from "@/app/app/component/SettingsSidebar";
import {useUser} from "@/app/providers/UserContext";

const primaryButtonClass =
  "h-auto min-h-[38px] rounded-[8px] bg-[#1d84c6] px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_28px_-22px_rgba(29,132,198,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#166fa8]";

const secondaryButtonClass =
  "h-auto min-h-[38px] rounded-[8px] border border-[#c9ddec] bg-white px-4 py-2 text-sm font-semibold text-[#28516d] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#79b8e2] hover:bg-[#f2f9ff] hover:text-[#1f75ad]";

const dangerButtonClass =
  "h-auto min-h-[38px] rounded-[8px] bg-[#ef4444] px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_28px_-22px_rgba(239,68,68,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#dc2626]";

const panelClass =
  "rounded-[8px] border border-[#e5edf5] bg-white shadow-[0_18px_42px_-36px_rgba(22,54,88,0.42)]";

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.6}
      stroke="currentColor"
      className="size-4 text-[#8a98a8]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#eaf5fc] text-[#1d84c6]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.6}
        stroke="currentColor"
        className="size-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
        />
      </svg>
    </span>
  );
}

function DeviceIcon({ type }: { type: "app" | "sms" }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#eaf5fc] text-[#1d84c6]">
      {type === "app" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.6}
          stroke="currentColor"
          className="size-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 1.5h3m-6 0h9A1.5 1.5 0 0 1 18 3v18a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 21V3a1.5 1.5 0 0 1 1.5-1.5Zm4.5 17.25h.008v.008H12v-.008Z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.6}
          stroke="currentColor"
          className="size-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm3.75 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm3.75 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12c0 4.142-4.03 7.5-9 7.5a10.9 10.9 0 0 1-3.692-.622L3 21l1.64-4.102C3.613 15.56 3 13.83 3 12c0-4.142 4.03-7.5 9-7.5s9 3.358 9 7.5Z"
          />
        </svg>
      )}
    </span>
  );
}

export default function AccountSettings() {
    const {
        me, user,
        reSendVerification, reSendVerificationSuccess, reSendVerificationisPending,
        updatePasswordForm, updatePassword, handlePasswordChangeInput, updatePasswordIsPending, updatePasswordError
    } = useUser();
    const isVerified = me?.email_verified_at

    const updatePasswordErrors = useMemo(() => {
      if (!isAxiosError(updatePasswordError)) {
        return [];
      }

      const rawErrors = updatePasswordError.response?.data?.errors;

      if (!rawErrors || typeof rawErrors !== "object") {
        return [];
      }

      return Object.values(rawErrors).flat().filter(Boolean);
    }, [updatePasswordError]);

    console.log('updatePasswordErrors', updatePasswordErrors)

  return (
    <div className="app app-wrapper min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-5 pb-12 pt-10 sm:px-8 sm:pt-12 lg:px-10 lg:pt-16">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="w-full min-w-0">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-normal text-[#4b9cdc]">
                Account Settings
              </p>
              <h1 className="mt-3 text-[40px] font-light leading-tight tracking-normal text-[#202020] sm:text-[48px]">
                Security
              </h1>
              <p className="mt-3 text-lg font-light leading-7 text-[#4e4e4e]">
                Manage account protection, password access, and sensitive account actions.
              </p>
            </div>

            <div className="mx-auto grid w-full min-w-0 gap-5 xl:mx-0">
              <Card className={panelClass}>
                <CardBody className="p-5 sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold text-[#202020]">
                          Email Verification
                        </h2>
                        <span className={(isVerified ? " bg-[#eaf7ef] text-[#219653] " : " bg-[#f7eaea] text-[#962121] ") + " rounded-full px-2.5 py-1 text-xs font-semibold"}>
                          {isVerified ? 'Verified' : 'Not Verified'}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-light text-[#526271]">
                          {isVerified ? 'Your email address has been verified and is active.' : 'Your email address has not yet verified.'}

                      </p>
                    </div>
                      {!me?.email_verified_at && (<Button onPress={() => reSendVerification()} className={secondaryButtonClass} disabled={reSendVerificationisPending} disableRipple>
                        {reSendVerificationSuccess ? 'Notification Sent!' : (reSendVerificationisPending ? 'Sending Verification...' : 'Re-send Verification')}
                    </Button>)}
                  </div>

                  <div className="mt-5 flex items-center gap-3 rounded-[8px] border border-[#e6eef6] bg-[#fbfdff] p-3">
                    <MailIcon />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#24323f]">
                          {me?.email}
                      </p>
                      <p className="mt-0.5 text-xs font-light text-[#728296]">
                          {isVerified && ( <>Verified {me?.email_verified_date}</>)}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className={panelClass}>
                <CardBody className="p-5 sm:p-6">
                  <div>
                    <h2 className="text-lg font-semibold text-[#202020]">
                      Change Password
                    </h2>
                    <p className="mt-1 text-sm font-light text-[#526271]">
                      Update your password to keep your account secure.
                    </p>
                  </div>


                  <div className="mt-5 grid gap-4">
                    <Input
                      label="Current Password"
                      labelPlacement="outside"
                      placeholder="Enter current password"
                      type="password"
                      radius="sm"
                      endContent={<EyeIcon />}
                      name="current_password"
                      value={updatePasswordForm.current_password}
                      onChange={(e) => handlePasswordChangeInput(e.target.name, e.target.value)}
                    />
                    <Input
                      label="New Password"
                      labelPlacement="outside"
                      placeholder="Enter new password"
                      type="password"
                      radius="sm"
                      endContent={<EyeIcon />}
                      name="new_password"
                      value={updatePasswordForm.new_password}
                      onChange={(e) => handlePasswordChangeInput(e.target.name, e.target.value)}
                    />
                    <div className="rounded-[8px] bg-[#f8fbfe] px-4 py-3">
                      <p className="text-xs font-semibold text-[#526271]">
                        Password requirements:
                      </p>
                      <ul className="mt-2 space-y-1 text-xs font-light text-[#728296]">
                        <li>At least 8 characters</li>
                        <li>Contains uppercase and lowercase letters</li>
                        <li>Contains numbers and symbols</li>
                      </ul>
                    </div>
                    <Input
                      label="Confirm New Password"
                      labelPlacement="outside"
                      placeholder="Confirm new password"
                      type="password"
                      radius="sm"
                      endContent={<EyeIcon />}
                      name="password"
                      value={updatePasswordForm.password}
                      onChange={(e) => handlePasswordChangeInput(e.target.name, e.target.value)}
                    />
                  </div>

                    {updatePasswordErrors.length > 0 && (
                      <Alert color="danger" className="mt-7">
                        <ul className="space-y-1">
                          {updatePasswordErrors.map((error, index) => (
                            <li key={`${error}-${index}`}>{error}</li>
                          ))}
                        </ul>
                      </Alert>
                    )}

                  <div className="mt-5 flex justify-end gap-3">
                    <Button className={secondaryButtonClass} disableRipple>
                      Cancel
                    </Button>
                    <Button disabled={updatePasswordIsPending} onPress={() => me?.id != null && updatePassword(me.id)} className={primaryButtonClass} disableRipple>
                        {updatePasswordIsPending ? 'Updating...' : 'Update Password'}
                    </Button>
                  </div>
                </CardBody>
              </Card>

              {/*<Card className={panelClass}>*/}
              {/*  <CardBody className="p-5 sm:p-6">*/}
              {/*    <div>*/}
              {/*      <h2 className="text-lg font-semibold text-[#202020]">*/}
              {/*        Two-Factor Authentication*/}
              {/*      </h2>*/}
              {/*      <p className="mt-1 text-sm font-light text-[#526271]">*/}
              {/*        Add an extra layer of security to your account.*/}
              {/*      </p>*/}
              {/*    </div>*/}

              {/*    <div className="mt-5 grid gap-3">*/}
              {/*      <div className="flex items-center justify-between gap-4 rounded-[8px] border border-[#e6eef6] bg-[#fbfdff] p-4">*/}
              {/*        <div className="flex min-w-0 items-center gap-3">*/}
              {/*          <DeviceIcon type="app" />*/}
              {/*          <div>*/}
              {/*            <p className="text-sm font-semibold text-[#24323f]">*/}
              {/*              Authenticator App*/}
              {/*            </p>*/}
              {/*            <p className="mt-0.5 text-xs font-light text-[#728296]">*/}
              {/*              Use an app to generate codes.*/}
              {/*            </p>*/}
              {/*          </div>*/}
              {/*        </div>*/}
              {/*        <Button className={primaryButtonClass} disableRipple>*/}
              {/*          Enable*/}
              {/*        </Button>*/}
              {/*      </div>*/}

              {/*      <div className="flex items-center justify-between gap-4 rounded-[8px] border border-[#e6eef6] bg-[#fbfdff] p-4">*/}
              {/*        <div className="flex min-w-0 items-center gap-3">*/}
              {/*          <DeviceIcon type="sms" />*/}
              {/*          <div>*/}
              {/*            <p className="text-sm font-semibold text-[#24323f]">*/}
              {/*              SMS Authentication*/}
              {/*            </p>*/}
              {/*            <p className="mt-0.5 text-xs font-light text-[#728296]">*/}
              {/*              Receive codes via text message.*/}
              {/*            </p>*/}
              {/*          </div>*/}
              {/*        </div>*/}
              {/*        <Switch size="sm" color="primary" />*/}
              {/*      </div>*/}
              {/*    </div>*/}
              {/*  </CardBody>*/}
              {/*</Card>*/}

              <Card className="rounded-[8px] border border-[#fee2e2] bg-[#fffafa] shadow-[0_18px_42px_-36px_rgba(127,29,29,0.35)]">
                <CardBody className="p-5 sm:p-6">
                  <div>
                    <h2 className="text-lg font-semibold text-[#dc2626]">
                      Danger Zone
                    </h2>
                    <p className="mt-1 text-sm font-light text-[#7f1d1d]">
                      Irreversible actions that affect your account.
                    </p>
                  </div>

                  <div className="mt-5 grid gap-3">
                    <div className="flex flex-col gap-3 rounded-[8px] border border-[#fee2e2] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[#24323f]">
                          Delete Account
                        </p>
                        <p className="mt-0.5 text-xs font-light text-[#728296]">
                          Permanently delete your account and all data.
                        </p>
                      </div>
                      <Button className={dangerButtonClass} disableRipple>
                        Delete Account
                      </Button>
                    </div>

                    <div className="flex flex-col gap-3 rounded-[8px] border border-[#fee2e2] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[#24323f]">
                          Deactivate Account
                        </p>
                        <p className="mt-0.5 text-xs font-light text-[#728296]">
                          Temporarily disable your account.
                        </p>
                      </div>
                      <Button
                        className="h-auto min-h-[38px] rounded-[8px] border border-[#fecaca] bg-white px-4 py-2 text-sm font-semibold text-[#dc2626] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#fff1f2]"
                        disableRipple
                      >
                        Deactivate
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>

          <div className="w-full min-w-0">
            <SettingsSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
