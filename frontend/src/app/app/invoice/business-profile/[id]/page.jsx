import BusinessProfileAppForm from "@/app/app/invoice/business-profile/Layout";
import {BusinessProfileProvider} from "@/app/providers/BusinessProfileContext";

export default function EditBusinessProfile({ params })
{
	return (
		<BusinessProfileProvider mode="edit" id={params.id}>
			<BusinessProfileAppForm />
		</BusinessProfileProvider>
	)
}