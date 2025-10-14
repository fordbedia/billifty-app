import {Button} from "@heroui/react";

export default function StreamlineBanner() {
    return (
         <div className="text-center">
            <div className="max-w-screen-lg my-20">
                <h2>Ready to streamline your invoicing?</h2>
                <p>Join thousands of professionals who trust Billifty for their billing needs.</p>

                <div className="max-w-screen-md m-auto my-10">
                    <Button className="main-button button-size" disableRipple color="default" size="lg">Start Creating Invoices <i className="arrow-right-icon"></i></Button>
                </div>
            </div>
         </div>
    )
}