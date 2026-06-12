import {BookOpen, ChevronRight, Mail, MessageCircle, Send, Zap} from "lucide-react";

const inputClass =
    "h-[34px] w-full rounded-[5px] border border-[#dce3ea] bg-white px-[13px] text-[12px] font-normal text-[#101827] outline-none transition-colors placeholder:text-[#9099a6] focus:border-[#2f6fe4]";

export default function ContactUs() {
    return (
        <main
            className="min-h-screen bg-[#fbfcfd] px-4 py-[34px] font-sans text-[#101827] sm:px-6"
            style={{
                backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.16) 1px, transparent 0)",
                backgroundSize: "20px 20px",
            }}
        >
            <section className="mx-auto grid w-full max-w-[834px] gap-[26px] lg:grid-cols-[540px_257px] lg:items-start">
                <div className="min-w-0">
                    <header>
                        <h1 className="text-[25px] font-extrabold leading-none tracking-[-0.03em] text-[#101827]">
                            Get in touch
                        </h1>
                        <p className="mt-[12px] max-w-[520px] text-[13px] font-normal leading-[1.45] text-[#536172]">
                            Need help with your account or have a feature request? Fill out the form below and our team
                            will get back to you shortly.
                        </p>
                    </header>

                    <form className="mt-[20px] rounded-[10px] border border-[#dce3ea] bg-white px-[27px] pb-[25px] pt-[28px] shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                        <div className="grid gap-[16px] sm:grid-cols-2 sm:gap-[19px]">
                            <label className="block">
                                <span className="text-[11px] font-semibold leading-none text-[#202a36]">Full Name</span>
                                <input className={`${inputClass} mt-[9px]`} placeholder="John Doe" type="text" />
                            </label>

                            <label className="block">
                                <span className="text-[11px] font-semibold leading-none text-[#202a36]">Email Address</span>
                                <input
                                    className={`${inputClass} mt-[9px]`}
                                    placeholder="john@company.com"
                                    type="email"
                                />
                            </label>
                        </div>

                        <label className="mt-[19px] block">
                            <span className="text-[11px] font-semibold leading-none text-[#202a36]">
                                What is this regarding?
                            </span>
                            <select
                                className={`${inputClass} mt-[9px] appearance-none bg-[linear-gradient(45deg,transparent_50%,#56616f_50%),linear-gradient(135deg,#56616f_50%,transparent_50%)] bg-[length:5px_5px,5px_5px] bg-[position:calc(100%-16px)_14px,calc(100%-11px)_14px] bg-no-repeat pr-9`}
                                defaultValue=""
                            >
                                <option value="" disabled>
                                    Select an option
                                </option>
                                <option>Account support</option>
                                <option>Billing question</option>
                                <option>Feature request</option>
                                <option>Technical issue</option>
                            </select>
                        </label>

                        <label className="mt-[19px] block">
                            <span className="text-[11px] font-semibold leading-none text-[#202a36]">Message</span>
                            <textarea
                                className="mt-[9px] h-[102px] w-full resize-none rounded-[5px] border border-[#dce3ea] bg-white px-[13px] py-[12px] text-[12px] font-normal text-[#101827] outline-none transition-colors placeholder:text-[#9099a6] focus:border-[#2f6fe4]"
                                placeholder="Please provide as much detail as possible..."
                            />
                        </label>

                        <button
                            className="mt-[26px] flex h-[39px] w-[159px] items-center justify-center gap-[7px] rounded-[6px] bg-[#2f6fe4] text-[13px] font-extrabold text-white shadow-[0_1px_1px_rgba(15,23,42,0.08)] transition-opacity hover:opacity-90"
                            type="submit"
                        >
                            Send Message
                            <Send className="h-[14px] w-[14px]" strokeWidth={2.3} />
                        </button>
                    </form>
                </div>

                <aside className="grid gap-[17px]">
                    <section className="overflow-hidden rounded-[10px] border border-[#dce3ea] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                        <div className="px-[16px] pb-[17px] pt-[19px]">
                            <h2 className="text-[13px] font-extrabold leading-none text-[#101827]">
                                Other Support Options
                            </h2>
                            <p className="mt-[8px] text-[11px] leading-none text-[#536172]">
                                Find quick answers or connect differently.
                            </p>
                        </div>

                        <div className="border-t border-[#eef1f4] py-[6px]">
                            <a className="grid grid-cols-[32px_1fr_14px] items-center gap-[12px] px-[16px] py-[10px] transition-colors hover:bg-[#f8fafc]" href="#">
                                <span className="flex h-[32px] w-[32px] items-center justify-center rounded-[6px] bg-[#f2f7ff] text-[#2f6fe4]">
                                    <BookOpen className="h-[15px] w-[15px]" strokeWidth={2} />
                                </span>
                                <span>
                                    <span className="block text-[12px] font-extrabold leading-none text-[#151d28]">
                                        Help Center
                                    </span>
                                    <span className="mt-[6px] block text-[10px] leading-[1.35] text-[#536172]">
                                        Browse articles, tutorials, and setup guides.
                                    </span>
                                </span>
                                <ChevronRight className="h-[14px] w-[14px] text-[#c1c7d0]" strokeWidth={1.8} />
                            </a>

                            <a className="grid grid-cols-[32px_1fr_14px] items-center gap-[12px] px-[16px] py-[10px] transition-colors hover:bg-[#f8fafc]" href="#">
                                <span className="flex h-[32px] w-[32px] items-center justify-center rounded-[6px] bg-[#eefbf4] text-[#16a36d]">
                                    <MessageCircle className="h-[15px] w-[15px]" strokeWidth={2} />
                                </span>
                                <span>
                                    <span className="block text-[12px] font-extrabold leading-none text-[#151d28]">
                                        Community Forum
                                    </span>
                                    <span className="mt-[6px] block text-[10px] leading-[1.35] text-[#536172]">
                                        Connect with other Billifty users and experts.
                                    </span>
                                </span>
                                <ChevronRight className="h-[14px] w-[14px] text-[#c1c7d0]" strokeWidth={1.8} />
                            </a>

                            <a className="grid grid-cols-[32px_1fr] items-center gap-[12px] px-[16px] py-[10px] transition-colors hover:bg-[#f8fafc]" href="mailto:support@billifty.com">
                                <span className="flex h-[32px] w-[32px] items-center justify-center rounded-[6px] bg-[#f8fafc] text-[#8a94a3]">
                                    <Mail className="h-[15px] w-[15px]" strokeWidth={1.8} />
                                </span>
                                <span>
                                    <span className="block text-[12px] font-extrabold leading-none text-[#151d28]">
                                        Direct Email
                                    </span>
                                    <span className="mt-[6px] block text-[10px] font-medium leading-none tracking-[0.08em] text-[#536172]">
                                        support@billifty.com
                                    </span>
                                </span>
                            </a>
                        </div>
                    </section>

                    <section className="rounded-[10px] border border-[#dce3ea] bg-white px-[16px] py-[17px] shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="flex items-center gap-[6px] text-[12px] font-extrabold leading-none text-[#101827]">
                                <Zap className="h-[13px] w-[13px] fill-[#f1b313] text-[#f1b313]" strokeWidth={2} />
                                System Status
                            </h2>
                            <span className="rounded-full bg-[#dff8ed] px-[7px] py-[3px] text-[8px] font-extrabold leading-none text-[#0d9a5d]">
                                OPERATIONAL
                            </span>
                        </div>
                        <p className="mt-[12px] text-[10px] leading-[1.35] text-[#536172]">
                            All systems are currently running smoothly. No known issues.
                        </p>
                        <a
                            className="mt-[13px] flex h-[29px] w-full items-center justify-center rounded-[5px] bg-[#11182d] text-[11px] font-extrabold text-white transition-opacity hover:opacity-90"
                            href="#"
                        >
                            View Status Page
                        </a>
                    </section>
                </aside>
            </section>
        </main>
    );
}
