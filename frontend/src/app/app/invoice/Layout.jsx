"use client";

import RootLayout from "@/app/components/common/RootLayout";
import { Button, Card, CardHeader, CardBody, CardFooter, Divider, Link } from "@heroui/react";
import InvoiceItem from "@/app/app/invoice/components/InvoiceItem";
import AddMoreItems from "@/app/app/invoice/components/buttons/AddMoreItems";
import InvoiceInfo from "@/app/app/invoice/components/InvoiceInfo";
import InvoiceTemplate from "@/app/app/invoice/components/InvoiceTemplate";
import { useInvoice } from "@/app/providers/InvoiceContext";
import Actions from "@/app/app/invoice/components/buttons/Actions";
import ConfirmIssueInvoiceModal from "@/app/app/invoice/components/modals/ConfirmIssueInvoiceModal";
import ConfirmNewInvoice from "@/app/app/invoice/components/modals/ConfirmNewInvoice";
import NotFound from "@/app/app/invoice/components/errorPages/NotFound";
import BSpinner from "@/app/components/Spinner";
import ConfirmDeleteModal from "@/app/app/invoice/components/modals/ConfirmDeleteModal";
import InvoicePreviewPage from "@/app/app/invoice/components/InvoicePreviewPage";

export default function Layout() {
  const {
    data,
    addItems,
    updateItems,
    removeItem,
    selectedCurrency,
    invoiceComputed,
		clearSticky,
		router,
		isInvoiceError,
		isLoadingInvoice,
		invoiceId,
  } = useInvoice();

  const currencySymbol = selectedCurrency?.symbol ?? "";

  // Fallback to data.* if invoiceComputed isn't ready for some reason
  const subtotalCents =
    invoiceComputed?.subtotal_cents ?? data.subtotal_cents ?? 0;
  const taxCents =
    invoiceComputed?.tax_cents ?? data.tax_cents ?? 0;
  const shippingTaxCents =
    invoiceComputed?.shipping_tax_cents ?? data.shipping_tax_cents ?? 0;
  const totalCents =
    invoiceComputed?.total_cents ?? data.total_cents ?? 0;
  const discountRow =
    invoiceComputed?.display_discount_row ?? data.display_discount_row ?? null;

	if (typeof isLoadingInvoice !== undefined && isLoadingInvoice) {
		return (
			<BSpinner />
		)
	}

  if (typeof isInvoiceError !== 'undefined' && isInvoiceError) {
	  return (
		  <RootLayout>
		  	<NotFound />
		  </RootLayout>
	  )
  }

  return (
    <RootLayout>
      <div className="app app-wrapper outer-bg">
				<ConfirmDeleteModal />
        <ConfirmIssueInvoiceModal />
				<ConfirmNewInvoice />
				<InvoicePreviewPage invoiceId={invoiceId} />
        <div className="m-auto max-w-screen-xl py-5">
          <div className="w-full flex mb-5">
            <div className="w-2/3">
              <h1 className="py-1">Invoice Portal</h1>
              <h2 className="py-1">
                Create and customize your invoice with items and templates
              </h2>
            </div>
            <div className="w-1/3 flex justify-end items-center">
              <Button variant="flat" color="success" onPress={() => {
				  clearSticky()
				  router.replace('/app/invoice/new')
			  }}>
				 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
				  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
				</svg>
				  New Invoice
			  </Button>
            </div>
          </div>

          <div className="w-full flex">
            <div className="w-2/3 mr-2">
              <InvoiceInfo />
              <Card fullWidth radius="sm">
                <CardHeader className="flex gap-3">
                  <div className="flex w-full justify-between items-center">
                    <h2>Invoice Items</h2>
                    <Button
                      onPress={addItems}
                      disableRipple
                      radius="sm"
                      className="add-invoice-item-btn"
                    >
                      <i className="plus-icon"></i>
                      Add Item
                    </Button>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <div className="px-1 py-1">
                    {data.invoice_items?.length > 0 &&
                      data.invoice_items.map((item, index) => (
                        <InvoiceItem
                          item={item}
                          key={index}
                          index={index}
                          onChange={updateItems}
                          removeItem={removeItem}
                        />
                      ))}

                    <AddMoreItems link={addItems} />
                  </div>
                </CardBody>
                <Divider />
                <CardFooter>
                  <section className="invoice-summary">
                    <div className="summary-row">
                      <span className="label">Subtotal (before tax):</span>
                      <span className="value">
                        {currencySymbol}
                        {(subtotalCents / 100).toFixed(2)}
                      </span>
                    </div>

                    {data.shipping_cents > 0 && (
                      <div className="summary-row">
                        <span className="label">Shipping:</span>
                        <span className="value">
                          {currencySymbol}
                          {(data.shipping_cents / 100).toFixed(2)}
                        </span>
                      </div>
                    )}

                    {shippingTaxCents > 0 && (
                      <div className="summary-row">
                        <span className="label">Shipping Tax:</span>
                        <span className="value">
                          {currencySymbol}
                          {(shippingTaxCents / 100).toFixed(2)}
                        </span>
                      </div>
                    )}

                    {discountRow && (
                      <div className="summary-row">
                        <span className="label">{discountRow.label}:</span>
                        <span className="value">
                          {currencySymbol}
                          {(Math.abs(discountRow.amount_cents) / 100).toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="summary-row">
                      <span className="label">Tax (items):</span>
                      <span className="value">
                        {currencySymbol}
                        {(taxCents / 100).toFixed(2)}
                      </span>
                    </div>

                    <hr className="divider" />

                    <div className="summary-row total">
                      <span className="label">Total:</span>
                      <span className="value accent">
                        {currencySymbol}
                        {(totalCents / 100).toFixed(2)}
                      </span>
                    </div>
                  </section>
                </CardFooter>
              </Card>
            </div>

            <div className="w-1/3 ml-2">
              <InvoiceTemplate />
              <Actions />
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
