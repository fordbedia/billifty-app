"use client"

import RootLayout from "@/app/components/common/RootLayout";
import {Avatar, Button, Card, CardBody, Divider, Input} from "@heroui/react";
import {Camera} from "@heroui/shared-icons";
import UserProfileCard from "@/app/app/profile/ProfilePhoto";
import SettingsSidebar from "@/app/app/component/SettingsSidebar";
import {useUser} from "@/app/providers/UserContext";
import Layout from "@/app/app/profile/layout";
import {PlanStatus} from "@/app/app/profile/ProfilePhoto";

export default function ProfilePage() {
    const {userProfile, setUserProfile, updateUserProfile, me, setAvatarFile, avatarFile} = useUser()
    return (
            <div className="app app-wrapper outer-bg">
                <div className="m-auto max-w-screen-xl py-5 md:px-0 px-5">
                    <div className="flex flex-col lg:flex-row px-4">
                        <div className="lg:w-1/4 mr-2">
                            <SettingsSidebar />
                        </div>
                        <div className="lg:w-3/4 lg:mt-0 mt-5 px-5 ml-2">
                            <Card>
                                <CardBody>
                                     <div className="flex w-full items-center justify-center gap-4">
                                         <div>
                                             <UserProfileCard
                                                 name={me?.name}
                                                 email={me?.email}
                                                 plan={me?.plan?.name as PlanStatus}
                                                 avatar={me?.image_url}
                                                 onPhotoSelected={(file) => setAvatarFile(file)}
                                             />
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            <Card className="mt-3">
                                <CardBody>
                                    <h2 className="text-5xl">Profile</h2>
                                    <form onSubmit={(e) => {
                                        e.preventDefault()
                                        updateUserProfile.mutate({ userProfile, avatarFile })
                                    }}>
                                        <div className="flex flex-col md:flex-row w-full gap-4 mt-5">
                                            <div className="flex flex-col gap-4 w-full">
                                                <Input
                                                  isRequired
                                                  label="First Name"
                                                  labelPlacement="outside"
                                                  name="name"
                                                  placeholder="Enter your first name"
                                                  value={userProfile?.fname}
                                                  onValueChange={(v) => setUserProfile((prev) => ({...prev, fname: v}))}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-4 w-full">
                                                <Input
                                                  isRequired
                                                  label="Last Name"
                                                  labelPlacement="outside"
                                                  name="name"
                                                  placeholder="Enter your last name"
                                                  value={userProfile?.lname}
                                                  onValueChange={(v) => setUserProfile((prev) => ({...prev, lname: v}))}
                                                />
                                            </div>
                                        </div>

                                        <Divider className="my-4" />

                                        <div className="flex flex-col justify-between md:flex-row w-full gap-4 mt-5">
                                            <Button
                                                className="bg-red-400 rounded-md text-white px-6"
                                                disableRipple
                                                disableAnimation
                                                size="md"
                                            >Change Email</Button>
                                            <Button type="submit" color="default" className="bg-indigo-400 rounded-md text-white" size="md">Save Changes</Button>
                                        </div>
                                    </form>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
    )
}