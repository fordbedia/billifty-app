"use client"

import {Button, Card, CardBody, Divider, Input} from "@heroui/react";
import UserProfileCard from "@/app/app/profile/ProfilePhoto";
import SettingsSidebar from "@/app/app/component/SettingsSidebar";
import {useUser} from "@/app/providers/UserContext";
import {PlanStatus} from "@/app/app/profile/ProfilePhoto";

const profilePrimaryButtonClass =
    "group h-auto min-h-[54px] rounded-[8px] bg-[#1d84c6] px-5 py-3 text-base font-semibold tracking-normal text-white shadow-[0_16px_32px_-22px_rgba(29,132,198,0.9)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#166fa8] hover:shadow-[0_22px_38px_-24px_rgba(29,132,198,0.95)] focus-visible:ring-2 focus-visible:ring-[#72bee9] focus-visible:ring-offset-2";

const profileSecondaryButtonClass =
    "h-auto min-h-[54px] rounded-[8px] border border-[#c9ddec] bg-white px-5 py-3 text-base font-semibold tracking-normal text-[#28516d] shadow-[0_10px_24px_-22px_rgba(34,74,104,0.65)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#79b8e2] hover:bg-[#f2f9ff] hover:text-[#1f75ad]";

export default function ProfilePage() {
    const {userProfile, setUserProfile, updateUserProfile, me, setAvatarFile, avatarFile} = useUser()
    return (
            <div className="app app-wrapper min-h-screen bg-white">
                <div className="mx-auto w-full max-w-[1440px] px-5 pb-12 pt-10 sm:px-8 lg:px-10 sm:pt-12 lg:pt-16">
                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
                        <div className="w-full min-w-0">
                            <div className="mb-8">
                                <p className="text-sm font-semibold uppercase tracking-normal text-[#4b9cdc]">
                                    Account Settings
                                </p>
                                <h1 className="mt-3 text-[40px] font-light leading-tight tracking-normal text-[#202020] sm:text-[48px]">
                                    My Profile
                                </h1>
                                <p className="mt-3 text-lg font-light leading-7 text-[#4e4e4e]">
                                    Manage your profile details and keep your account identity up to date.
                                </p>
                            </div>

                            <Card className="border border-[#dbe7f3] bg-white shadow-[0_28px_64px_-48px_rgba(22,54,88,0.46)]">
                                <CardBody className="px-5 py-6 sm:px-6">
                                    <UserProfileCard
                                        name={me?.name}
                                        email={me?.email}
                                        plan={me?.plan?.name as PlanStatus}
                                        avatar={me?.image_url}
                                        onPhotoSelected={(file) => setAvatarFile(file)}
                                    />
                                </CardBody>
                            </Card>

                            <Card className="mt-5 border border-[#dbe7f3] bg-white shadow-[0_28px_64px_-48px_rgba(22,54,88,0.46)]">
                                <CardBody className="px-5 py-6 sm:px-7">
                                    <div className="border-b border-[#e7edf4] pb-4">
                                        <p className="text-sm font-semibold uppercase tracking-normal text-[#738496]">
                                            Personal details
                                        </p>
                                        <h2 className="mt-1 text-xl font-semibold text-[#24323f]">
                                            Profile Information
                                        </h2>
                                    </div>
                                    <form onSubmit={(e) => {
                                        e.preventDefault()
                                        updateUserProfile.mutate({ userProfile: userProfile ?? {}, avatarFile })
                                    }}>
                                        <div className="mt-6 grid w-full gap-4 md:grid-cols-2">
                                            <div className="w-full">
                                                <Input
                                                  isRequired
                                                  label="First Name"
                                                  labelPlacement="outside"
                                                  name="name"
                                                  placeholder="Enter your first name"
                                                  value={userProfile?.fname ?? ""}
                                                  onValueChange={(v) => setUserProfile((prev) => ({...prev, fname: v}))}
                                                  radius="sm"
                                                />
                                            </div>
                                            <div className="w-full">
                                                <Input
                                                  isRequired
                                                  label="Last Name"
                                                  labelPlacement="outside"
                                                  name="name"
                                                  placeholder="Enter your last name"
                                                  value={userProfile?.lname ?? ""}
                                                  onValueChange={(v) => setUserProfile((prev) => ({...prev, lname: v}))}
                                                  radius="sm"
                                                />
                                            </div>
                                        </div>

                                        <Divider className="my-6 bg-[#e7edf4]" />

                                        <div className="flex w-full flex-col justify-between gap-3 md:flex-row md:items-center">
                                            <Button
                                                className={profileSecondaryButtonClass}
                                                disableRipple
                                                disableAnimation
                                                size="md"
                                            >Change Email</Button>
                                            <Button type="submit" className={profilePrimaryButtonClass} size="md">Save Changes</Button>
                                        </div>
                                    </form>
                                </CardBody>
                            </Card>
                        </div>
                        <div className="w-full min-w-0">
                            <SettingsSidebar />
                        </div>
                    </div>
                </div>
            </div>
    )
}
