import {Divider} from "@heroui/divider";
import {Button} from "@heroui/react";
import {Form, Input} from "@heroui/react";
import React, {useState} from "react";
import {useApp} from "@/app/providers/AppContext";
import OptionLinks from "@/app/auth/OptionLinks";

export default function SignIn({ handleFormChange, onSubmit, user }) {
    const [action, setAction] = useState(null);
    const {
			setSelectedTab,
		} = useApp()
    return (
        <div className="auth-wrapper">
            <h2>Welcome back</h2>
            <p>Sign in to your account to continue</p>
            <OptionLinks />
            <div className="">
                <Divider className="absolute" />
                <div className="divider-text">Or</div>
            </div>

            <Form
              className="w-full flex flex-col gap-4"
              onReset={() => setAction("reset")}
              onSubmit={(e) => {
                e.preventDefault();
                let data = Object.fromEntries(new FormData(e.currentTarget));

                setAction(`submit ${JSON.stringify(data)}`);
								onSubmit()
              }}
            >
                  <Input
                    isRequired
                    errorMessage="Please enter a valid email"
                    label="Email"
                    labelPlacement="outside"
                    name="email"
                    placeholder="Enter your email"
                    type="email"
                    radius="sm"
                    variant="bordered"
                    size="lg"
										onValueChange={(v) => handleFormChange('email', v)}
										value={user.email}
                  />
                <Input
                  isRequired
                  label="Password"
                  labelPlacement="outside"
                  name="password"
                  placeholder="Enter your password"
                  type="password"
                  radius="sm"
                  variant="bordered"
                  size="lg"
									onValueChange={(v) => handleFormChange('password', v)}
									value={user.password}
                />

              <div className="flex gap-2 w-full">
                <Button type="submit" fullWidth radius="sm" className="submit-btn">
                  Sign In
                </Button>
              </div>
            </Form>

            <div className="mt-5 flex justify-center">
                <p>Don't have an account? <a href={"#"} onClick={() => setSelectedTab('signup')}>Sign up</a></p>
            </div>

        </div>
    )
}