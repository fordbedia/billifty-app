export default function InfoBanner() {
    return (
        <div className="text-center">
            <div className="max-w-screen-lg my-28">
                <h2>Everything you need to invoice professionally</h2>
                <p>Powerful features designed to make invoicing simple and efficient</p>

                <div className="flex md:flex-row flex-col justify-center banner-group my-15">
                    <div className="mx-10 justify-items-center my-5">
                        <div className="group-icon w-15 h-15 content-center mb-5">
                            <i className="paint-brush-icon"></i>
                        </div>
                        <h2>Custom Templates</h2>
                        <p>Choose from a variety of professional templates and customize colors to match your brand</p>
                    </div>
                    <div className="mx-10">
                        <div className="mx-10 justify-items-center my-5">
                            <div className="group-icon w-15 h-15 content-center mb-5">
                                <i className="lightning-icon"></i>
                            </div>
                        </div>
                        <h2>Lightning Fast</h2>
                        <p>Create and send invoices in minutes with our streamlined interface and smart features</p>
                    </div>
                    <div className="mx-10">
                        <div className="mx-10 justify-items-center my-5">
                            <div className="group-icon w-15 h-15 content-center mb-5">
                                <i className="mobile-icon"></i>
                            </div>
                        </div>
                        <h2>Mobile Ready</h2>
                        <p>Access and manage your invoices from anywhere with our responsive design</p>
                    </div>
                </div>
            </div>
        </div>
    )
}