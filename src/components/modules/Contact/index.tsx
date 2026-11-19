"use client";

import React from "react";
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
  FaPhone,
  FaLocationDot,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { Home, Loader2, Send } from "lucide-react";

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

  const servicesList = [
    "Product Listing Assistance",
    "Buyer & Seller Support",
    "Account & Verification Help",
    "Payment & Transaction Issues",
    "Delivery & Logistics Support",
    "Other",
  ];

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const response = await addContact(data);
      if (response?.success) {
        toast.success(
          "Thank you! Your message has been sent. We'll get back to you soon."
        );
        form.reset();
      } else {
        const errorMsg =
          response?.error?.[0]?.message ||
          response?.message ||
          "Could not send message. Please try again.";
        toast.error(errorMsg);
      }
    } catch {
      toast.error("Something went wrong! Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-slate-950/20">
      <Container className="py-6 sm:py-8 lg:py-10">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/"
                    className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 hover:text-[#F59E0B] transition-colors"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Home</span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className="text-xs sm:text-sm font-semibold text-[#F59E0B]">
                  Contact Us
                </span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1F2937] dark:text-white tracking-tight">
            Contact our team
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            Got any questions about buying or selling products? We are here to help.
          </p>
        </div>

        {/* Main Grid: Form (Left) & Contact Details (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Section */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm font-semibold text-[#1F2937] dark:text-white">
                          First name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="First name"
                            className="h-10 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]"
                          />
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
                        <FormLabel className="text-xs sm:text-sm font-semibold text-[#1F2937] dark:text-white">
                          Last name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Last name"
                            className="h-10 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email Address */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm font-semibold text-[#1F2937] dark:text-white">
                        Email <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="you@company.com"
                          className="h-10 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm font-semibold text-[#1F2937] dark:text-white">
                        Phone <span className="text-slate-400 font-normal text-xs">(Optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          placeholder="+880 1XXX-XXXXXX"
                          className="h-10 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]"
                        />
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
                      <FormLabel className="text-xs sm:text-sm font-semibold text-[#1F2937] dark:text-white">
                        Message <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Leave us a message..."
                          className="w-full h-32 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] resize-y"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Services Checkboxes */}
                <FormField
                  control={form.control}
                  name="services"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm font-semibold text-[#1F2937] dark:text-white">
                        Services
                      </FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          {servicesList.map((service) => {
                            const isChecked = field.value?.includes(service) ?? false;
                            return (
                              <label
                                key={service}
                                className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs sm:text-sm cursor-pointer transition-colors ${
                                  isChecked
                                    ? "bg-amber-50 dark:bg-amber-950/40 border-[#F59E0B] text-[#1F2937] dark:text-white font-medium"
                                    : "bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  value={service}
                                  checked={isChecked}
                                  onChange={() => {
                                    const currentValues = field.value || [];
                                    const updated = isChecked
                                      ? currentValues.filter((item) => item !== service)
                                      : [...currentValues, service];
                                    field.onChange(updated);
                                  }}
                                  className="w-4 h-4 rounded text-[#F59E0B] accent-[#F59E0B] cursor-pointer"
                                />
                                <span>{service}</span>
                              </label>
                            );
                          })}
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
                    className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold py-3 px-6 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send message</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>

          {/* Contact Info Section */}
          <div className="lg:col-span-5 space-y-6">
            {/* 1. Chat with us */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs">
              <h3 className="text-lg font-bold text-[#1F2937] dark:text-white">
                Chat with us
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
                Speak to our friendly team via live chat.
              </p>

              <div className="flex flex-col gap-2.5 mt-5">
                <a
                  href="https://wa.me/8801315773424"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs sm:text-sm font-medium border-slate-200 dark:border-slate-700 text-[#1F2937] dark:text-white hover:text-[#F59E0B] hover:border-[#F59E0B] transition-colors cursor-pointer flex items-center gap-2.5 h-11"
                  >
                    <FaWhatsapp className="w-4 h-4 text-[#F59E0B] shrink-0" />
                    <span>Start a live chat with WhatsApp</span>
                  </Button>
                </a>

                <a
                  href="mailto:moshfiqurrahman37@gmail.com"
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs sm:text-sm font-medium border-slate-200 dark:border-slate-700 text-[#1F2937] dark:text-white hover:text-[#F59E0B] hover:border-[#F59E0B] transition-colors cursor-pointer flex items-center gap-2.5 h-11"
                  >
                    <MdEmail className="w-4 h-4 text-[#F59E0B] shrink-0" />
                    <span>Shoot us an email</span>
                  </Button>
                </a>

                <a
                  href="https://www.linkedin.com/in/moshfiqur-rahman-a302b32a3/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs sm:text-sm font-medium border-slate-200 dark:border-slate-700 text-[#1F2937] dark:text-white hover:text-[#F59E0B] hover:border-[#F59E0B] transition-colors cursor-pointer flex items-center gap-2.5 h-11"
                  >
                    <FaLinkedin className="w-4 h-4 text-[#F59E0B] shrink-0" />
                    <span>Message us on LinkedIn</span>
                  </Button>
                </a>
              </div>
            </div>

            {/* 2. Call us */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs">
              <h3 className="text-lg font-bold text-[#1F2937] dark:text-white">
                Call us
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
                Call our team Mon-Fri from 9am to 6pm.
              </p>
              <a
                href="tel:+8801315773424"
                className="inline-flex items-center gap-2 font-semibold text-sm sm:text-base text-[#F59E0B] hover:text-[#D97706] mt-3 transition-colors"
              >
                <FaPhone className="w-4 h-4 shrink-0" />
                <span>+880 13 15-77 3424</span>
              </a>
            </div>

            {/* 3. Visit us */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs">
              <h3 className="text-lg font-bold text-[#1F2937] dark:text-white">
                Visit us
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
                Visit us in person at our Dhaka office.
              </p>
              <p className="flex items-center gap-2 font-semibold text-sm sm:text-base text-[#F59E0B] mt-3">
                <FaLocationDot className="w-4 h-4 shrink-0" />
                <span>25/B, Dhanmondi, Dhaka, Bangladesh</span>
              </p>

              {/* Map embed */}
              <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 mt-4">
                <iframe
                  title="ResellBD Dhanmondi Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14608.03694485078!2d90.36710787834574!3d23.74705004457497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b33cffc3fb%3A0x4a826f475fd312af!2sDhanmondi%2C%20Dhaka%201205!5e0!3m2!1sen!2sbd!4v1711200000000!5m2!1sen!2sbd"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
