import  BusinessProfileAppForm from "@/app/app/invoice/business-profile/Layout";
import {BusinessProfileProvider} from "@/app/providers/BusinessProfileContext";

export default function BusinessProfileNew() {
	return (
		<BusinessProfileProvider mode="new">
			<BusinessProfileAppForm />
		</BusinessProfileProvider>
	)
}