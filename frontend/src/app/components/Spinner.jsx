import {Spinner} from "@heroui/react";

export default function BSpinner() {
	return (
		<div className="flex justify-center h-full mt-12 mb-12">
			<Spinner color="default" classNames={{label: "text-foreground mt-4 items-center"}} label="Loading..." variant="wave" />
		</div>
	)
}