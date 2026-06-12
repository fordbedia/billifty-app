export const uri = Object.freeze({
	h: '/',
	auth: '/auth',
	intro: '/intro',
	onboarding: '/app/onboarding',
	pricing: '/app/invoice/pricing',
	checkout: '/app/checkout',
	checkout_success: '/app/checkout/success',
	invoices: '/app/invoices',
	create_invoice: '/app/invoice/new',
	manage_subscriptions: '/app/account/manage-subscription',
	manage_payment_methods: '/app/account/manage-subscription/payment-method',
	invoice: (param) => `/app/invoice/${param}`,
	send_invoice: (param) => `/app/invoice/${param}/send`,
	contact_message: '/app/contact-us',
	// business profile
	business_profile: {
		create: '/app/invoice/business-profile/new',
		lists: '/app/invoice/business-profile'
	},
	// Client
	client: {
		clients: '/app/invoice/client',
		create_client: '/app/invoice/client/new'
	},
	api: {
		downloadPdf: (invoiceId) => `/api/v1/invoice/${invoiceId}/pdf/download`
	},
	profile: '/app/profile',
	accountSettings: '/app/account-settings',
})
