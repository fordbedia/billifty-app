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

export default function Authentication() {
    const {
        selectedTab,
        setSelectedTab
    } = useApp()

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
                                    <SignIn />
                                </CardBody>
                            </Card>
                        </Tab>
                        <Tab key="signup" title="Sign Up">
                            <Card className="auth-tab">
                                <CardBody>
                                     <Signup />
                                </CardBody>
                            </Card>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </RootLayout>
    )
}