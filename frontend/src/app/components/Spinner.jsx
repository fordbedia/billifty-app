export default function BSpinner() {
	return (
		<div className="flex min-h-[360px] w-full items-center justify-center px-5 py-12">
			<div className="flex w-full max-w-[360px] flex-col items-center rounded-[8px] border border-[#dbe7f3] bg-white px-8 py-9 text-center shadow-[0_28px_64px_-48px_rgba(22,54,88,0.46)]">
				<div className="relative mb-6 flex h-16 w-16 items-center justify-center">
					<span className="absolute h-16 w-16 rounded-full border border-[#d8ebf8]" />
					<span className="absolute h-16 w-16 animate-spin rounded-full border-2 border-transparent border-t-[#1d84c6]" />
					<span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#eaf5fc] text-[#1d84c6]">
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
					</span>
				</div>
				<p className="text-sm font-semibold uppercase tracking-normal text-[#4b9cdc]">
					Preparing workspace
				</p>
				<h2 className="mt-2 text-2xl font-light tracking-normal text-[#202020]">
					Loading your invoice tools
				</h2>
				<p className="mt-3 text-sm font-light leading-6 text-[#526271]">
					Fetching the latest billing details and keeping your workspace in sync.
				</p>
		</div>
		</div>
	)
}
