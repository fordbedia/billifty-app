import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@heroui/react";
import {Textarea, Input, Button} from "@heroui/react";

export default function ClientInformation() {
    return (
         <Card fullWidth radius="sm" className="mt-5">
            <CardHeader className="flex gap-3">
                <h3 className="py-1">Client Information</h3>
            </CardHeader>
            <Divider />
            <CardBody>
                <div className="flex flex-col md:flex-row gap-2 py-2">
                    <div className="md:w-1/2">
                        Client Name
                        <Input
                            isRequired
                            errorMessage="Please enter a valid name"
                            labelPlacement="outside"
                            name="client_name"
                            placeholder="Enter your name"
                            type="text"
                            variant="bordered"
                            radius="sm"
                          />
                    </div>
                    <div className="md:w-1/2">
                        Email
                        <Input
                            isRequired
                            errorMessage="Please enter a valid email"
                            labelPlacement="outside"
                            name="email"
                            placeholder="Enter your email"
                            type="text"
                            variant="bordered"
                            radius="sm"
                          />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-2 py-2">
                    <div className="md:w-1/2">
                        Address
                        <Textarea
                            variant="bordered"
                            className="max-w-xs"
                            placeholder="Enter address"
                            radius="sm"
                        />
                    </div>
                </div>
            </CardBody>
         </Card>
    )
}