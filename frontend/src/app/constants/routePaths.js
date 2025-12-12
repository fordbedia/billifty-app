export const uri = Object.freeze({
	h: '/',
	auth: '/auth',
	intro: '/intro',
	pricing: '/app/invoice/pricing',
	checkout: '/app/checkout',
	checkout_success: '/app/checkout/success',
	invoices: '/app/invoices',
	create_invoice: '/app/invoice/new',
	invoice: (param) => `/app/invoice/${param}`,
	send_invoice: (param) => `/app/invoice/${param}/send`,
	// business profile
	business_profile: {
		lists: '/app/invoice/business-profile'
	},
	// Client
	client: {
		clients: '/app/invoice/client',
		create_client: '/app/invoice/client/new'
	},
	api: {
		downloadPdf: (invoiceId) => `/api/v1/invoice/${invoiceId}/pdf/download`
	}
})