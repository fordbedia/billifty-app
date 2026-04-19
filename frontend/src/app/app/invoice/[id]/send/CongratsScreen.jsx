"use client";

const SuccessIcon = ({ children }) => (
  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-[#eaf7ef] text-[#219653] ring-1 ring-[#cdeed9]">
    {children}
  </div>
);

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.6}
    stroke="currentColor"
    className="size-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
    />
  </svg>
);

const PdfIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.6}
    stroke="currentColor"
    className="size-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
    />
  </svg>
);

const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.6}
    stroke="currentColor"
    className="size-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
    />
  </svg>
);

function DetailRow({ icon, title, description }) {
  return (
    <div className="group flex gap-4 rounded-[8px] border border-[#e3edf5] bg-white p-4 shadow-[0_12px_28px_-24px_rgba(31,64,91,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#b8d9ee] hover:shadow-[0_18px_36px_-26px_rgba(31,112,169,0.7)]">
      <SuccessIcon>{icon}</SuccessIcon>
      <div className="min-w-0">
        <h3 className="text-base font-semibold leading-6 text-[#24323f]">
          {title}
        </h3>
        <p className="mt-1 text-sm font-light leading-6 text-[#526271]">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function CongratsScreen({ invoice, options, footer }) {
  const selectedOption = options.selectedOption;
  const invoiceNumber = invoice?.invoice_number;

  const details = [];

  if (selectedOption === "sendCopyToMe") {
    details.push(
      {
        icon: <MailIcon />,
        title: "Email Sent Successfully",
        description: `A copy of invoice #${invoiceNumber} has been sent to your email ${invoice?.business_profile?.email}`,
      },
      {
        icon: <PdfIcon />,
        title: "PDF Generated",
        description: "High-quality PDF created and attached to the email",
      }
    );
  }

  if (selectedOption === "directSendToClient") {
    details.push({
      icon: <MailIcon />,
      title: "Email Sent Successfully",
      description: `A copy of invoice #${invoiceNumber} has been sent to ${invoice?.client?.email}`,
    });
  }

  if (selectedOption === "downloadPdf") {
    details.push(
      {
        icon: <PdfIcon />,
        title: "PDF Generated",
        description: "High-quality PDF created",
      },
      {
        icon: <DownloadIcon />,
        title: "PDF Downloaded",
        description: "A PDF was automatically downloaded to your desktop",
      }
    );
  }

  return (
    <div className="congrats-page min-h-screen bg-white px-5 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto flex w-full max-w-[920px] flex-col items-center">
        <div className="mb-6 flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[#eaf7ef] text-[#219653] shadow-[0_20px_46px_-30px_rgba(33,150,83,0.8)] ring-1 ring-[#cbeed8]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="size-9"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>
        </div>

        <div className="max-w-[720px] text-center">
          <p className="text-sm font-semibold uppercase tracking-normal text-[#4b9cdc]">
            Invoice delivery complete
          </p>
          <h1 className="mt-3 text-[40px] font-light leading-tight tracking-normal text-[#202020] sm:text-[54px]">
            Congratulations!
          </h1>
          <p className="mt-4 text-lg font-light leading-7 text-[#4e4e4e]">
            Your invoice has been successfully processed. Here is what happened.
          </p>
        </div>

        <div className="mt-9 w-full overflow-hidden rounded-[14px] border border-[#dbe7f3] bg-[#f8fbfe] shadow-[0_28px_64px_-48px_rgba(22,54,88,0.46)]">
          <div className="flex flex-col gap-4 border-b border-[#e5eef6] bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-normal text-[#738496]">
                Summary
              </p>
              <h2 className="mt-1 text-xl font-semibold text-[#24323f]">
                Invoice #{invoiceNumber}
              </h2>
            </div>
            <span className="w-fit rounded-full border border-[#cdeed9] bg-[#eaf7ef] px-3 py-1.5 text-sm font-semibold text-[#219653]">
              Completed
            </span>
          </div>

          <div className="grid gap-4 p-5 sm:p-6">
            {details.map((detail) => (
              <DetailRow
                key={detail.title}
                icon={detail.icon}
                title={detail.title}
                description={detail.description}
              />
            ))}
          </div>
        </div>

        <div className="w-full max-w-[920px]">{footer}</div>
      </div>
    </div>
  );
}
