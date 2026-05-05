"use client"

import RootLayout from "@/app/components/common/RootLayout";
import {Tabs, Tab, Card, CardBody, Button} from "@heroui/react";
import SignIn from "@/app/auth/SignIn";
import Signup from "@/app/auth/Signup";
import React, {
    useState,
    useEffect,
    type Dispatch,
    type SetStateAction,
} from "react";
import {useApp} from "@/app/providers/AppContext";
import {UserProvider, useUser} from "@/app/providers/UserContext";
import {useAuth} from "@/app/providers/AuthContext";

export function Component() {
    const {
        selectedTab,
        setSelectedTab,
    } = useApp()

    const {
        handleChange: handleFormSignInChange,
        login,
        user: userValue,
        errors: loginErrors
    } = useAuth()

    const {
        user,
		handleChange,
        saveUser,
        errors,
        saveUserIsPending,
    } = useUser()

    return (
        <RootLayout>
            <div className="max-w-screen-sm m-auto my-20">
                <div className="flex w-full flex-col">
                    <Tabs aria-label="Options"
                          size="lg"
                          fullWidth
                          selectedKey={selectedTab}
                          onSelectionChange={(key) => setSelectedTab(key as string)}
                    >
                        <Tab key="signin" title="Sign In">
                            <Card className="auth-tab">
                                <CardBody>
                                    <SignIn
                                        onSubmit={login}
                                        handleFormChange={handleFormSignInChange}
                                        user={userValue}
                                        formErrors={loginErrors}
                                    />
                                </CardBody>
                            </Card>
                        </Tab>
                        <Tab key="signup" title="Sign Up">
                            <Card className="auth-tab">
                                <CardBody>
                                     <Signup
                                         formErrors={errors}
                                         user={user}
                                         handleChange={handleChange}
                                         save={saveUser}
                                         saveUserIsPending={saveUserIsPending}
                                     />
                                </CardBody>
                            </Card>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </RootLayout>
    )
}

export default function Authentication() {
    return (
        <UserProvider>
            <Component />
        </UserProvider>
    )
}