import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@heroui/react";
import {useInvoice} from "@/app/providers/InvoiceContext";
import Templates from "@/app/app/invoice/themes/Templates";
import ColorSchemes from "@/app/app/invoice/themes/ColorSchemes";
export default function InvoiceTemplate() {
	const {
		templateCategoryData,
		selectedTemplate,
		selectedColorScheme,
		loadThemeSelector,
	} = useInvoice()

    return(
        <>
			<Templates />
			<ColorSchemes />
            <Card fullWidth radius="sm" className="mb-2 workspace-card invoice-side-card">
                <CardHeader className="flex gap-3">
                    <div>
                        <h3>Invoice Templates</h3>
                        <p className="text-sm text-default-500">Choose a style that matches your brand voice.</p>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody>
                    <div className="box-design-wrapper">
                        <div className="design-box py-3 flex flex-col md:flex-row w-full">
							{(selectedTemplate && Object.keys(selectedTemplate).length === 0) ? (
							<>
							{templateCategoryData && Object.keys(templateCategoryData).length > 0 && templateCategoryData.map(t => (
								<div key={t.id} onClick={() => loadThemeSelector(t.id)} className="inner-box rounded-md px-5 py-3 w-64 mx-3">
									<Image
										radius="none"
										priority="true"
										quality={100}
										width={276}
										height={70}
										src={t.preview_url} alt={t.display_name + " Design"}/>
									<h3 className="py-1">{t.display_name}</h3>
								</div>
							))}
							</>
							) : (
								<div className="inner-box-preview">
									<div className="flex" onClick={() => loadThemeSelector()}>
										<Image src={selectedTemplate.preview_url} width="50" height="30" />
										<div className="px-2">
											<h2>Current Template: {selectedTemplate?.display_name}</h2>
											<h3>Current Color: {selectedColorScheme?.color_scheme_name}</h3>
										</div>
									</div>
								</div>
							)}
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/*<Card fullWidth radius="sm" className="mt-4 mb-4">*/}
            {/*    <CardHeader className="flex gap-3">*/}
            {/*        Color Schemes*/}
            {/*    </CardHeader>*/}
            {/*    <Divider />*/}
            {/*    <CardBody>*/}
            {/*        <div className="box-design-wrapper">*/}
            {/*            <div className="design-box py-3 w-full">*/}
            {/*                <div className="inner-box rounded-md px-5 py-3 mx-3 my-3">*/}
            {/*                    <div className="flex flex-nowrap">*/}
            {/*                        <Image*/}
            {/*                            radius="none"*/}
            {/*                            priority="true"*/}
            {/*                            quality={100}*/}
            {/*                            width={94}*/}
            {/*                            height={31}*/}
            {/*                            src="/images/invoice-selection/ocean-blue.png" alt="Modern Design" />*/}
            {/*                        <h3 className="py-1 px-3">Ocean Blue</h3>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <div className="inner-box rounded-md px-4 py-3 mx-3 my-3">*/}
            {/*                    <div className="flex flex-nowrap">*/}
            {/*                        <Image*/}
            {/*                            radius="none"*/}
            {/*                            priority="true"*/}
            {/*                            quality={100}*/}
            {/*                            width={94}*/}
            {/*                            height={31}*/}
            {/*                            src="/images/invoice-selection/forest-green.png" alt="Classic Design" />*/}
            {/*                        <h3 className="py-1 px-3">Forest Green</h3>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <div className="inner-box rounded-md px-4 py-3 mx-3 my-3">*/}
            {/*                    <div className="flex flex-nowrap">*/}
            {/*                        <Image*/}
            {/*                            radius="none"*/}
            {/*                            priority="true"*/}
            {/*                            quality={100}*/}
            {/*                            width={94}*/}
            {/*                            height={31}*/}
            {/*                            src="/images/invoice-selection/royal-purple.png" alt=" Minimal Design" />*/}
            {/*                        <h3 className="py-1 px-3">Royal Purple</h3>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <div className="inner-box rounded-md px-4 py-3 mx-3 my-3">*/}
            {/*                    <div className="flex flex-nowrap">*/}
            {/*                        <Image*/}
            {/*                            radius="none"*/}
            {/*                            priority="true"*/}
            {/*                            quality={100}*/}
            {/*                            width={94}*/}
            {/*                            height={31}*/}
            {/*                            src="/images/invoice-selection/crimson-red.png" alt=" Minimal Design" />*/}
            {/*                        <h3 className="py-1 px-3">Crimson Red</h3>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <div className="inner-box rounded-md px-4 py-3 mx-3 my-3">*/}
            {/*                    <div className="flex flex-nowrap">*/}
            {/*                        <Image*/}
            {/*                            radius="none"*/}
            {/*                            priority="true"*/}
            {/*                            quality={100}*/}
            {/*                            width={94}*/}
            {/*                            height={31}*/}
            {/*                            src="/images/invoice-selection/sunset-orange.png" alt=" Minimal Design" />*/}
            {/*                        <h3 className="py-1 px-3">Sunset Orange</h3>*/}
            {/*                    </div>*/}
            {/*                </div>*/}

            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </CardBody>*/}
            {/*</Card>*/}
        </>
    )
}
