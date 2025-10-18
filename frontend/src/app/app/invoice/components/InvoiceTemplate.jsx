import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@heroui/react";

export default function InvoiceTemplate() {
    return(
        <>
            <Card fullWidth radius="sm" className="mb-2">
                <CardHeader className="flex gap-3">
                    Invoices Templates
                </CardHeader>
                <Divider />
                <CardBody>
                    <div className="box-design-wrapper">
                        <div className="design-box py-3 flex flex-col md:flex-row w-full">
                            <div className="inner-box rounded-md px-5 py-3 w-64 mx-3">
                                <Image
                                    radius="none"
                                    priority="true"
                                    quality={100}
                                    width={276}
                                    height={70}
                                    src="/images/invoice-selection/modern.png" alt="Modern Design" />
                                <h3 className="py-1">Modern</h3>
                            </div>
                            <div className="inner-box rounded-md px-4 py-3 w-64 mx-3">
                                <Image
                                    radius="none"
                                    priority="true"
                                    quality={100}
                                    width={276}
                                    height={70}
                                    src="/images/invoice-selection/classic.png" alt="Classic Design" />
                                <h3 className="py-1">Classic</h3>
                            </div>
                            <div className="inner-box rounded-md px-4 py-3 w-64 mx-3">
                                <Image
                                    radius="none"
                                    priority="true"
                                    quality={100}
                                    width={276}
                                    height={70}
                                    src="/images/invoice-selection/minimal.png" alt=" Minimal Design" />
                                <h3 className="py-1">Minimal</h3>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>

            <Card fullWidth radius="sm" className="mt-4">
                <CardHeader className="flex gap-3">
                    Color Schemes
                </CardHeader>
                <Divider />
                <CardBody>
                    <div className="box-design-wrapper">
                        <div className="design-box py-3 flex flex-col md:flex-row w-full">
                            <div className="inner-box rounded-md px-5 py-3 w-64 mx-3">
                                <Image
                                    radius="none"
                                    priority="true"
                                    quality={100}
                                    width={276}
                                    height={70}
                                    src="/images/invoice-selection/modern.png" alt="Modern Design" />
                                <h3 className="py-1">Modern</h3>
                            </div>
                            <div className="inner-box rounded-md px-4 py-3 w-64 mx-3">
                                <Image
                                    radius="none"
                                    priority="true"
                                    quality={100}
                                    width={276}
                                    height={70}
                                    src="/images/invoice-selection/classic.png" alt="Classic Design" />
                                <h3 className="py-1">Classic</h3>
                            </div>
                            <div className="inner-box rounded-md px-4 py-3 w-64 mx-3">
                                <Image
                                    radius="none"
                                    priority="true"
                                    quality={100}
                                    width={276}
                                    height={70}
                                    src="/images/invoice-selection/minimal.png" alt=" Minimal Design" />
                                <h3 className="py-1">Minimal</h3>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </>
    )
}