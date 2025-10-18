import {Input} from "@heroui/react";

export default function InvoiceItem() {
    return (
        <div className="box-card px-4 py-4 my-3">
            <div className="flex flex-col md:flex-row gap-5">
                <div className="md:w-1/4">
                    Description
                    <Input
                        type="text"
                        variant="bordered"
                        radius="sm"
                    />
                </div>
                <div className="md:w-1/4">
                    Quantity
                    <Input
                        type="text"
                        variant="bordered"
                        radius="sm"
                    />
                </div>
                <div className="md:w-1/4">
                    Rate
                    <Input
                        type="text"
                        variant="bordered"
                        radius="sm"
                    />
                </div>
                <div className="md:w-1/4">
                    Amount
                    <Input
                        type="text"
                        variant="bordered"
                        radius="sm"
                    />
                </div>
                <div className="self-center">
                    <i className="trash-icon"></i>
                </div>
            </div>
        </div>
    )
}
