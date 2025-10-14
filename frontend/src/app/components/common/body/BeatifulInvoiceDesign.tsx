import Image from 'next/image'
import {Button} from "@heroui/react";
import ModernInvoiceDesign from '@/images/modern-invoice-design.png'
import ClassicInvoiceDesign from '@/images/classic-invoice-design.png'
import MinimalInvoiceDesign from '@/images/minimal-invoice-design.png'

export default function BeautifulInvoiceDesign() {
    return (
         <div className="text-center">
            <div className="max-w-screen-lg my-28">
                <h2>Beautiful Invoice Designs</h2>
                <p>Choose from our collection of professionally crafted invoice templates.
                    Each design is carefully created to make your business look professional and trustworthy.
                </p>
                <div className="flex md:flex-row flex-col justify-center banner-group my-3">
                    <div className="mx-10 justify-items-center my-5">
                        <div className="w-sm h-sm content-center">
                            <Image
                                priority quality={100}
                                alt="Modern Invoice Design"
                                src={ModernInvoiceDesign} width="373" height="384" />
                        </div>
                        <h2>Modern & Clean</h2>
                        <p>Perfect for tech companies and modern businesses</p>
                    </div>

                    <div className="mx-10 justify-items-center my-5">
                        <div className="w-sm h-sm content-center">
                            <Image
                                priority quality={100}
                                alt="Classic Invoice Design"
                                src={ClassicInvoiceDesign} width="373" height="384" />
                        </div>
                        <h2>Classic & Professional</h2>
                        <p>Timeless design for established businesses</p>
                    </div>

                    <div className="mx-10 justify-items-center my-5">
                        <div className="w-sm h-sm content-center">
                            <Image
                                priority quality={100}
                                alt="Minimal Invoice Design"
                                src={MinimalInvoiceDesign} width="373" height="384" />
                        </div>
                        <h2>Minimal & Elegant</h2>
                        <p>Clean design for creative professionals</p>
                    </div>
                </div>
                <p>Each template is fully customizable with your brand colors, logo, and business information.
                    Create invoices that reflect your professional image and help you get paid faster.</p>

                <div className="max-w-screen-md m-auto my-5">
                    <Button className="main-button button-size" disableRipple color="default" size="lg">Get Started Free <i className="arrow-right-icon"></i></Button>
                </div>
            </div>
         </div>
    )
}