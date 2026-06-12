"use client"

import type {FormEvent} from "react";
import {BookOpen, CheckCircle2, ChevronRight, Mail, MessageCircle, Send, Sparkles, Zap} from "lucide-react";
import {useMutation} from "@tanstack/react-query";
import ContactMessage from "@/app/models/ContactMessage";
import {useUser} from "@/app/providers/UserContext";

const inputClass =
    "h-[44px] w-full rounded-[7px] border border-[#dce3ea] bg-white px-[16px] text-[14px] font-normal text-[#101827] outline-none transition-colors placeholder:text-[#9099a6] focus:border-[#2f6fe4]";

export default function ContactUs() {
    const {me} = useUser()
    const {mutateAsync: send, isPending, isSuccess} = useMutation({
        mutationFn: async (payload: FormData) => (await ContactMessage.create(payload))
    })

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await send(new FormData(event.currentTarget));
    };

    return (
        <main
            className="min-h-screen bg-[#fbfcfd] px-4 py-[42px] font-sans text-[#101827] sm:px-6"
            style={{
                backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.16) 1px, transparent 0)",
                backgroundSize: "20px 20px",
            }}
        >
            <section className="mx-auto grid w-full max-w-[1040px] gap-[32px] lg:grid-cols-[660px_320px] lg:items-start">
                <div className="min-w-0">
                    <header>
                        <h1 className="text-[32px] font-extrabold leading-none tracking-[-0.03em] text-[#101827]">
                            Get in touch
                        </h1>
                        <p className="mt-[14px] max-w-[620px] text-[15px] font-normal leading-[1.5] text-[#536172]">
                            Need help with your account or have a feature request? Fill out the form below and our team
                            will get back to you shortly.
                        </p>
                    </header>
                    {!isSuccess ? (
                    <form onSubmit={handleSubmit} className="mt-[24px] rounded-[12px] border border-[#dce3ea] bg-white px-[32px] pb-[31px] pt-[33px] shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                        {!me && (
                            <div className="grid gap-[18px] sm:grid-cols-2 sm:gap-[22px]">
                                <label className="block">
                                    <span className="text-[13px] font-semibold leading-none text-[#202a36]">Full Name</span>
                                    <input className={`${inputClass} mt-[10px]`} name="name" placeholder="John Doe" type="text" />
                                </label>

                                <label className="block">
                                    <span className="text-[13px] font-semibold leading-none text-[#202a36]">Email Address</span>
                                    <input
                                        className={`${inputClass} mt-[10px]`}
                                        name="email"
                                        placeholder="john@company.com"
                                        type="email"
                                    />
                                </label>
                            </div>
                        )}

                        <label className="mt-[23px] block">
                            <span className="text-[13px] font-semibold leading-none text-[#202a36]">
                                What is this regarding?
                            </span>
                            <select
                                className={`${inputClass} mt-[10px] appearance-none bg-[linear-gradient(45deg,transparent_50%,#56616f_50%),linear-gradient(135deg,#56616f_50%,transparent_50%)] bg-[length:5px_5px,5px_5px] bg-[position:calc(100%-18px)_19px,calc(100%-13px)_19px] bg-no-repeat pr-10`}
                                defaultValue=""
                                name="subject"
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

                        <label className="mt-[23px] block">
                            <span className="text-[13px] font-semibold leading-none text-[#202a36]">Message</span>
                            <textarea
                                className="mt-[10px] h-[128px] w-full resize-none rounded-[7px] border border-[#dce3ea] bg-white px-[16px] py-[14px] text-[14px] font-normal text-[#101827] outline-none transition-colors placeholder:text-[#9099a6] focus:border-[#2f6fe4]"
                                name="message"
                                placeholder="Please provide as much detail as possible..."
                            />
                        </label>

                        <button
                            className="cursor-pointer mt-[30px] flex h-[48px] w-[184px] items-center justify-center gap-[8px] rounded-[7px] bg-[#2f6fe4] text-[15px] font-extrabold text-white shadow-[0_1px_1px_rgba(15,23,42,0.08)] transition-opacity hover:opacity-90"
                            disabled={isPending}
                            type="submit"
                        >
                            {isPending ? "Sending..." : "Send Message"}
                            <Send className="h-[16px] w-[16px]" strokeWidth={2.3} />
                        </button>
                    </form>
                    ) : (
                        <div className="mt-[24px] overflow-hidden rounded-[16px] border border-[#bfe8d6] bg-white shadow-[0_18px_45px_-34px_rgba(16,185,129,0.65)]">
                            <div className="relative px-[32px] pb-[31px] pt-[33px]">
                                <div className="absolute right-[-46px] top-[-52px] h-[148px] w-[148px] rounded-full bg-[#dcfce7]" />
                                <div className="absolute bottom-[-72px] left-[-64px] h-[156px] w-[156px] rounded-full bg-[#eff6ff]" />

                                <div className="relative">
                                    <div className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#e8fbf1] text-[#13a56b] shadow-[inset_0_0_0_1px_rgba(19,165,107,0.14)]">
                                        <CheckCircle2 className="h-[30px] w-[30px]" strokeWidth={2.3} />
                                    </div>

                                    <div className="mt-[22px] inline-flex items-center gap-[7px] rounded-full border border-[#c9ead9] bg-[#f4fff9] px-[12px] py-[6px] text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#12845a]">
                                        <Sparkles className="h-[13px] w-[13px]" strokeWidth={2.2} />
                                        Message delivered
                                    </div>

                                    <h2 className="mt-[14px] text-[26px] font-extrabold leading-tight tracking-[-0.03em] text-[#101827]">
                                        Your message is on its way.
                                    </h2>

                                    <p className="mt-[10px] max-w-[520px] text-[15px] leading-[1.65] text-[#536172]">
                                        Thanks for reaching out. We received your request and sent a confirmation to your
                                        email. Our team will review the details and get back to you shortly.
                                    </p>

                                    <div className="mt-[22px] rounded-[12px] border border-[#dcefe5] bg-[#fbfffd] px-[18px] py-[15px]">
                                        <p className="text-[13px] font-semibold leading-[1.55] text-[#24323f]">
                                            Typical response time: <span className="text-[#12845a]">within 1 business day</span>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <aside className="grid gap-[20px]">
                    <section className="overflow-hidden rounded-[12px] border border-[#dce3ea] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                        <div className="px-[20px] pb-[20px] pt-[23px]">
                            <h2 className="text-[15px] font-extrabold leading-none text-[#101827]">
                                Other Support Options
                            </h2>
                            <p className="mt-[9px] text-[13px] leading-none text-[#536172]">
                                Find quick answers or connect differently.
                            </p>
                        </div>

                        <div className="border-t border-[#eef1f4] py-[6px]">
                            <a className="grid grid-cols-[40px_1fr_16px] items-center gap-[14px] px-[20px] py-[13px] transition-colors hover:bg-[#f8fafc]" href="#">
                                <span className="flex h-[40px] w-[40px] items-center justify-center rounded-[8px] bg-[#f2f7ff] text-[#2f6fe4]">
                                    <BookOpen className="h-[18px] w-[18px]" strokeWidth={2} />
                                </span>
                                <span>
                                    <span className="block text-[14px] font-extrabold leading-none text-[#151d28]">
                                        Help Center
                                    </span>
                                    <span className="mt-[7px] block text-[12px] leading-[1.35] text-[#536172]">
                                        Browse articles, tutorials, and setup guides.
                                    </span>
                                </span>
                                <ChevronRight className="h-[16px] w-[16px] text-[#c1c7d0]" strokeWidth={1.8} />
                            </a>

                            <a className="grid grid-cols-[40px_1fr_16px] items-center gap-[14px] px-[20px] py-[13px] transition-colors hover:bg-[#f8fafc]" href="#">
                                <span className="flex h-[40px] w-[40px] items-center justify-center rounded-[8px] bg-[#eefbf4] text-[#16a36d]">
                                    <MessageCircle className="h-[18px] w-[18px]" strokeWidth={2} />
                                </span>
                                <span>
                                    <span className="block text-[14px] font-extrabold leading-none text-[#151d28]">
                                        Community Forum
                                    </span>
                                    <span className="mt-[7px] block text-[12px] leading-[1.35] text-[#536172]">
                                        Connect with other Billifty users and experts.
                                    </span>
                                </span>
                                <ChevronRight className="h-[16px] w-[16px] text-[#c1c7d0]" strokeWidth={1.8} />
                            </a>

                            <a className="grid grid-cols-[40px_1fr] items-center gap-[14px] px-[20px] py-[13px] transition-colors hover:bg-[#f8fafc]" href="mailto:support@billifty.com">
                                <span className="flex h-[40px] w-[40px] items-center justify-center rounded-[8px] bg-[#f8fafc] text-[#8a94a3]">
                                    <Mail className="h-[18px] w-[18px]" strokeWidth={1.8} />
                                </span>
                                <span>
                                    <span className="block text-[14px] font-extrabold leading-none text-[#151d28]">
                                        Direct Email
                                    </span>
                                    <span className="mt-[7px] block text-[12px] font-medium leading-none tracking-[0.08em] text-[#536172]">
                                        support@billifty.com
                                    </span>
                                </span>
                            </a>
                        </div>
                    </section>

                    <section className="rounded-[12px] border border-[#dce3ea] bg-white px-[20px] py-[20px] shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="flex items-center gap-[7px] text-[14px] font-extrabold leading-none text-[#101827]">
                                <Zap className="h-[15px] w-[15px] fill-[#f1b313] text-[#f1b313]" strokeWidth={2} />
                                System Status
                            </h2>
                            <span className="rounded-full bg-[#dff8ed] px-[8px] py-[4px] text-[9px] font-extrabold leading-none text-[#0d9a5d]">
                                OPERATIONAL
                            </span>
                        </div>
                        <p className="mt-[14px] text-[12px] leading-[1.4] text-[#536172]">
                            All systems are currently running smoothly. No known issues.
                        </p>
                        <a
                            className="mt-[15px] flex h-[36px] w-full items-center justify-center rounded-[6px] bg-[#11182d] text-[13px] font-extrabold text-white transition-opacity hover:opacity-90"
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
