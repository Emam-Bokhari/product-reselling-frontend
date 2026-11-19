"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  useForm,
  SubmitHandler,
  FormProvider,
  FieldValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Send,
  Sparkles,
  Check,
  Home,
  CheckCircle2,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  Loader2,
  User,
  Phone,
  MessageSquare,
} from "lucide-react";
import {
  FaWhatsapp,
  FaLinkedin,
  FaFacebook,
} from "react-icons/fa6";

import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { contactSchema } from "./contact.validation";
import { addContact } from "@/services/Contact";

export default function ContactUsForm() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
      services: [] as string[],
    },
    resolver: zodResolver(contactSchema),
  });

  const {
    formState: { isSubmitting },
  } = form;

  const contactServices = [
    "Product Listing Assistance",
    "Buyer & Seller Support",
    "Account & Verification Help",
    "Payment & Transaction Issues",
    "Delivery & Logistics Support",
    "Dispute or Safety Concern",
    "Partnership & Bulk Sales",
    "General Feedback",
  ];

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const response = await addContact(data);
      if (response?.success) {
        toast.success(
          "Thank you! Your message has been sent. We'll get back to you shortly."
        );
        form.reset();
        setSubmitted(true);
      } else {
        const errorMsg =
          response?.error?.[0]?.message ||
          response?.message ||
          "Could not submit inquiry. Please try again.";
        toast.error(errorMsg);
      }
    } catch {
      toast.error("Network error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/20">
      <Container className="py-6 sm:py-8 lg:py-12">
        {/* ============================================================
            BREADCRUMB
            ============================================================ */}
        <div className="mb-6 sm:mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/"
                    className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 hover:text-amber-500 transition-colors"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Home</span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className="text-xs sm:text-sm font-semibold text-amber-600 dark:text-amber-400">
                  Contact Us
                </span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* ============================================================
            HERO HEADER
            ============================================================ */}
        <section className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8 sm:p-12 lg:p-14 overflow-hidden border border-slate-800 shadow-xl mb-10 sm:mb-14">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 mb-5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>We&apos;re Here to Help You 7 Days a Week</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.18] text-white">
              Get in Touch with the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                ResellBD Support Team
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Have questions regarding device verification, safety, payment assistance, or need help
              closing a deal? Our dedicated customer care team in Dhaka is always ready to assist you.
            </p>
          </div>
        </section>

        {/* ============================================================
            3 FAST CHANNELS RIBBON
            ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10 sm:mb-14">
          {/* Channel 1: Phone */}
          <a
            href="tel:+8801315773424"
            className="group bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-amber-400/60 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center border border-amber-200/60 dark:border-amber-800/60 group-hover:scale-105 transition-transform">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Lines
                </span>
              </div>
              <h3 className="text-base font-bold text-[#1F2937] dark:text-white">
                Call Our Hotline
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Speak directly with an agent for urgent help.
              </p>
              <p className="text-sm font-extrabold text-amber-600 dark:text-amber-400 mt-3 font-mono">
                +880 131 577 3424
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-between group-hover:text-amber-600 transition-colors">
              <span>Mon - Fri (9 AM - 8 PM)</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </a>

          {/* Channel 2: WhatsApp */}
          <a
            href="https://wa.me/8801315773424?text=Hello%20ResellBD%20Support%2C%20I%20have%20an%20inquiry"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-emerald-400/60 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/60 group-hover:scale-105 transition-transform">
                  <FaWhatsapp className="w-6 h-6" />
                </div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Instant Chat
                </span>
              </div>
              <h3 className="text-base font-bold text-[#1F2937] dark:text-white">
                WhatsApp Live Chat
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Fastest response for quick questions &amp; screenshots.
              </p>
              <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-3">
                Chat with ResellBD Support
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-between group-hover:text-emerald-600 transition-colors">
              <span>Avg response: ~15 mins</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </a>

          {/* Channel 3: Email */}
          <a
            href="mailto:support@resellbd.com"
            className="group bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-blue-400/60 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center border border-blue-200/60 dark:border-blue-800/60 group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 px-2.5 py-1 rounded-full">
                  24/7 Ticketing
                </span>
              </div>
              <h3 className="text-base font-bold text-[#1F2937] dark:text-white">
                Official Email Helpdesk
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                For dispute resolution, safety complaints &amp; partnerships.
              </p>
              <p className="text-sm font-extrabold text-blue-600 dark:text-blue-400 mt-3 font-mono">
                support@resellbd.com
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-between group-hover:text-blue-600 transition-colors">
              <span>Detailed ticket follow-ups</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </a>
        </div>

        {/* ============================================================
            MAIN 2-COLUMN SECTION: FORM & OFFICE DETAILS
            ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* ------------------------------------------------------------
              LEFT COLUMN: CONTACT FORM (7 COLS)
              ------------------------------------------------------------ */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200/90 dark:border-slate-800 shadow-2xs text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto mb-5 border border-emerald-200/60 shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#1F2937] dark:text-white">
                  Message Sent Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
                  Thank you for reaching out to ResellBD. Our team has received your message and will
                  reply via your email or phone number as soon as possible.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <Button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                    className="rounded-xl text-xs font-bold border-slate-200 dark:border-slate-700"
                  >
                    Send Another Message
                  </Button>
                  <Link href="/products">
                    <Button className="rounded-xl text-xs font-bold bg-[#F59E0B] hover:bg-[#D97706] text-white">
                      Browse Marketplace
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                <div className="mb-8">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    Send an Inquiry
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] dark:text-white tracking-tight mt-1">
                    How Can We Assist You?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                    Please provide your contact information and details. Required fields are marked
                    with an asterisk (<span className="text-red-500">*</span>).
                  </p>
                </div>

                <FormProvider {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    {/* First & Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              First Name <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <Input
                                  {...field}
                                  placeholder="Tanvir"
                                  className="pl-10 h-11 text-xs sm:text-sm rounded-xl bg-slate-50/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:bg-white"
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              Last Name <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <Input
                                  {...field}
                                  placeholder="Ahmed"
                                  className="pl-10 h-11 text-xs sm:text-sm rounded-xl bg-slate-50/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:bg-white"
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              Email Address <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="tanvir@example.com"
                                  className="pl-10 h-11 text-xs sm:text-sm rounded-xl bg-slate-50/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:bg-white"
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              Phone Number <span className="text-slate-400 text-[11px] font-normal">(Optional)</span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <Input
                                  {...field}
                                  type="tel"
                                  placeholder="+880 17XX-XXXXXX"
                                  className="pl-10 h-11 text-xs sm:text-sm rounded-xl bg-slate-50/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:bg-white"
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Services Chips */}
                    <FormField
                      control={form.control}
                      name="services"
                      render={({ field }) => (
                        <FormItem className="pt-1">
                          <FormLabel className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Select Topic / Assistance Area <span className="text-slate-400 text-[11px] font-normal">(Select all that apply)</span>
                          </FormLabel>
                          <FormControl>
                            <div className="flex flex-wrap gap-2 pt-1">
                              {contactServices.map((service) => {
                                const isSelected = field.value?.includes(service);
                                return (
                                  <button
                                    type="button"
                                    key={service}
                                    onClick={() => {
                                      const current = field.value || [];
                                      const updated = isSelected
                                        ? current.filter((item) => item !== service)
                                        : [...current, service];
                                      field.onChange(updated);
                                    }}
                                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer border ${
                                      isSelected
                                        ? "bg-amber-500 text-slate-950 border-amber-500 shadow-xs"
                                        : "bg-slate-50/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400 hover:bg-amber-50/40"
                                    }`}
                                  >
                                    {isSelected ? (
                                      <span className="flex items-center gap-1.5">
                                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                        {service}
                                      </span>
                                    ) : (
                                      service
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Message */}
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Your Message <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Textarea
                                {...field}
                                placeholder="Please explain your question or issue in detail..."
                                className="min-h-[140px] p-3.5 text-xs sm:text-sm rounded-xl bg-slate-50/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:bg-white leading-relaxed resize-y"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Submit Button */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto min-w-[200px] h-12 bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold px-8 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Sending message...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Send Message</span>
                          </>
                        )}
                      </Button>
                      <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Your personal information is secure and never shared with third parties.</span>
                      </p>
                    </div>
                  </form>
                </FormProvider>
              </div>
            )}
          </div>

          {/* ------------------------------------------------------------
              RIGHT COLUMN: OFFICE & TRUST DETAILS (5 COLS)
              ------------------------------------------------------------ */}
          <div className="lg:col-span-5 space-y-6">
            {/* 1. Office Location Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center border border-amber-200/60">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1F2937] dark:text-white">
                    Dhaka Headquarters
                  </h3>
                  <p className="text-xs text-slate-400">Head Office &amp; Operations</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                25/B, Road 4, Dhanmondi, Dhaka - 1205, Bangladesh
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Near Science Lab Metro Station &amp; Opposite City College
              </p>

              {/* Interactive Google Map Embed */}
              <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xs mt-4">
                <iframe
                  title="ResellBD Dhanmondi Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14608.03694485078!2d90.36710787834574!3d23.74705004457497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b33cffc3fb%3A0x4a826f475fd312af!2sDhanmondi%2C%20Dhaka%201205!5e0!3m2!1sen!2sbd!4v1711200000000!5m2!1sen!2sbd"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale-[20%] contrast-[1.05]"
                />
              </div>

              <div className="mt-3.5 flex justify-end">
                <a
                  href="https://maps.google.com/?q=Dhanmondi,Dhaka,Bangladesh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                >
                  <span>Open in Google Maps</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* 2. Operating Hours Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center border border-blue-200/60">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1F2937] dark:text-white">
                    Support Schedule
                  </h3>
                  <p className="text-xs text-slate-400">Bangladesh Standard Time (BST)</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Monday - Friday:</span>
                  <span className="font-bold text-slate-900 dark:text-white">9:00 AM – 8:00 PM</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Saturday:</span>
                  <span className="font-bold text-slate-900 dark:text-white">10:00 AM – 6:00 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Sunday &amp; Holidays:</span>
                  <span className="font-semibold text-amber-600">Emergency Chat &amp; Email</span>
                </div>
              </div>
            </div>

            {/* 3. Quick Self-Service Links */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-850 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Need Immediate Answers?
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Check our knowledge base for answers to common questions about buying, selling, and safety.
              </p>

              <div className="mt-4 space-y-2">
                <Link
                  href="/faq"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    Frequently Asked Questions
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/aboutUs"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    How ResellBD Verifies Tech
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>

              {/* Social Channels */}
              <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Connect with us:</span>
                <div className="flex items-center gap-2.5">
                  <a
                    href="https://wa.me/8801315773424"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center text-slate-300 transition-colors"
                    title="WhatsApp"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                  </a>
                  <a
                    href="https://www.facebook.com/emambokhari99"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white flex items-center justify-center text-slate-300 transition-colors"
                    title="Facebook"
                  >
                    <FaFacebook className="w-4 h-4" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/moshfiqur-rahman-a302b32a3/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-sky-600 hover:text-white flex items-center justify-center text-slate-300 transition-colors"
                    title="LinkedIn"
                  >
                    <FaLinkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
