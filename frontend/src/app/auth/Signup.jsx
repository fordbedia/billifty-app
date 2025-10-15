import OptionLinks from "@/app/auth/OptionLinks";
import {Divider} from "@heroui/divider";
import {useAuth} from "@/app/providers/AuthContext";

import React from "react";
import {Form, Input, Select, SelectItem, Checkbox, Button} from "@heroui/react";

export default function Signup() {
    const {
        password,
        setPassword,
        errors,
        setErrors,
        submitted,
        setSubmitted,
        showValidation,
        setShowValidation
    } = useAuth()

    const getPasswordError = (value) => {
        if (value.length < 4) {
          return "Password must be 4 characters or more";
        }
        if ((value.match(/[A-Z]/g) || []).length < 1) {
          return "Password needs at least 1 uppercase letter";
        }
        if ((value.match(/[^a-z]/gi) || []).length < 1) {
          return "Password needs at least 1 symbol";
        }

        return null;
    };

      const onSubmit = (e) => {
        e.preventDefault();
        setShowValidation(true);
        const data = Object.fromEntries(new FormData(e.currentTarget));

        // Custom validation checks
        const newErrors  = {};

        // Password validation
        const passwordError = getPasswordError(data.password);

        if (passwordError) {
          newErrors.password = passwordError;
        }

        // Username validation
        if (data.name === "admin") {
          newErrors.name = "Please choose a different name";
        }

        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);

          return;
        }

        if (data.terms !== "true") {
          setErrors({terms: "Please accept the terms"});

          return;
        }

        // Clear errors and submit
        setErrors({});
        setSubmitted(data);
      };


    return (
        <div className="auth-wrapper">
            <h2>Create an account</h2>
            <p>Start generating professional invoices today</p>
            <OptionLinks />
            <div className="">
                <Divider className="absolute" />
                <div className="divider-text">Or</div>
            </div>


            <Form
              className="w-full justify-center items-center space-y-4"
              validationErrors={errors}
              onReset={() => setSubmitted(null)}
              onSubmit={onSubmit}
            >
              <div className="flex flex-col gap-4 w-full">
                <Input
                  isRequired
                  errorMessage={({validationDetails}) => {
                    if (validationDetails.valueMissing) {
                      return "Please enter your name";
                    }

                    return errors.name;
                  }}
                  label="Name"
                  labelPlacement="outside"
                  name="name"
                  placeholder="Enter your name"
                  radius="sm"
                  variant="bordered"
                  size="lg"
                />

                <Input
                  isRequired
                  errorMessage={({validationDetails}) => {
                    if (validationDetails.valueMissing) {
                      return "Please enter your email";
                    }
                    if (validationDetails.typeMismatch) {
                      return "Please enter a valid email address";
                    }
                  }}
                  label="Email"
                  labelPlacement="outside"
                  name="email"
                  placeholder="Enter your email"
                  type="email"
                  radius="sm"
                  variant="bordered"
                  size="lg"
                />

                <Input
                  isRequired
                  errorMessage={showValidation ? getPasswordError(password) ?? undefined : undefined}
                  isInvalid={showValidation ? Boolean(getPasswordError(password)) : false}
                  label="Password"
                  labelPlacement="outside"
                  name="password"
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onValueChange={setPassword}
                  radius="sm"
                  variant="bordered"
                  size="lg"
                />

                <Select
                  isRequired
                  label="Country"
                  labelPlacement="outside"
                  name="country"
                  placeholder="Select country"
                  radius="sm"
                  variant="bordered"
                  size="lg"
                >
                  <SelectItem key="ar">Argentina</SelectItem>
                  <SelectItem key="us">United States</SelectItem>
                  <SelectItem key="ca">Canada</SelectItem>
                  <SelectItem key="uk">United Kingdom</SelectItem>
                  <SelectItem key="au">Australia</SelectItem>
                </Select>

                <Checkbox
                  isRequired
                  classNames={{
                    label: "text-small",
                  }}
                  isInvalid={!!errors.terms}
                  name="terms"
                  validationBehavior="aria"
                  value="true"
                  onValueChange={() => setErrors((prev) => ({...prev, terms: undefined}))}
                >
                  I agree to the terms and conditions
                </Checkbox>

                {errors.terms && <span className="text-danger text-small">{errors.terms}</span>}

                <div className="flex gap-4">
                  <Button className="w-full submit-btn" fullWidth radius="sm" type="submit">
                    Submit
                  </Button>
                </div>
              </div>

              {submitted && (
                <div className="text-small text-default-500 mt-4">
                  Submitted data: <pre>{JSON.stringify(submitted, null, 2)}</pre>
                </div>
              )}
            </Form>

        </div>
    )
}