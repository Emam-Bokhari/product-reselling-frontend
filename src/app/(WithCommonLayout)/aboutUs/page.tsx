import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  ShieldCheck,
  Lock,
  Truck,
  Eye,
  Star,
  Home,
  ArrowRight,
} from "lucide-react";

import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import pattern from "@/assets/pattern.jpg";
import visionImage from "@/assets/vision.jpg";

export const metadata: Metadata = {
  title: "About Us | ResellBD - Pre-Owned Tech & Gadgets Marketplace",
  description:
    "ResellBD is Bangladesh's trusted platform for buying and selling verified pre-owned smartphones, laptops, and gadgets with zero hassle.",
};

export default function AboutUsPage() {
  const features = [
    {
      title: "Certified Quality",
      description: "Ensuring the best experience for our users.",
      icon: ShieldCheck,
    },
    {
      title: "Secure Transactions",
      description: "Ensuring the best experience for our users.",
      icon: Lock,
    },
    {
      title: "Fast Shipping",
      description: "Ensuring the best experience for our users.",
      icon: Truck,
    },
    {
      title: "Complete Transparency",
      description: "Ensuring the best experience for our users.",
      icon: Eye,
    },
  ];

  const testimonials = [
    "ResellBD made it so easy to sell my old phone. The process was smooth, and I got a great price!",
    "I was hesitant to buy a used laptop, but ResellBD's verification process gave me confidence. Highly recommend!",
    "Fantastic experience! Secure payments and fast shipping. Will definitely use ResellBD again!",
  ];

  const faqs = [
    {
      question: "How does ResellBD verify listed products?",
      answer:
        "Every product listed on ResellBD goes through a verification process. Sellers must provide valid product images and details. Additionally, buyers can review seller ratings and feedback before making a purchase.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept payments via major mobile banking services like bKash, Nagad, Rocket, as well as debit/credit cards for secure transactions.",
    },
    {
      question: "Is there a return policy?",
      answer:
        "Yes, we offer a return policy under specific conditions. If the received product does not match the listing description, buyers can request a return within 3 days of delivery.",
    },
    {
      question: "How can I sell my device on ResellBD?",
      answer:
        "Selling is easy! Create an account, list your product with images and details, set a price, and wait for buyers to contact you. Once sold, you can arrange for secure delivery through our platform.",
    },
  ];

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
                  About Us
                </span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Hero Section */}
        <div
          className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden text-white flex items-center justify-center shadow-xs"
          style={{
            backgroundImage: `url(${pattern.src})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          {/* Subtle Dark Overlay */}
          <div className="absolute inset-0 bg-black/70" />

          {/* Hero Content */}
          <div className="relative z-10 text-center px-4 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              About <span className="text-[#F59E0B]">Us</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base md:text-lg text-slate-200 font-normal leading-relaxed">
              ResellBD - Your Trusted Marketplace for Pre-Owned Tech &amp; Gadgets.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-10 sm:mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-[#F59E0B] flex items-center justify-center mb-4 border border-amber-200/60 dark:border-amber-800/60">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1F2937] dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vision Section */}
        <div className="mt-12 sm:mt-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Image */}
            <div className="lg:col-span-5 relative w-full h-[260px] sm:h-[320px] lg:h-[360px] rounded-xl overflow-hidden border border-slate-200/90 dark:border-slate-800">
              <Image
                src={visionImage}
                alt="Our Vision"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 500px"
              />
            </div>

            {/* Right: Vision Text Content */}
            <div className="lg:col-span-7">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] dark:text-white">
                Our Vision
              </h2>
              <div className="space-y-3.5 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mt-4">
                <p>
                  At ResellBD, we envision a world where technology is more accessible,
                  affordable, and sustainable. Our goal is to revolutionize the resale market
                  in Bangladesh by providing a reliable platform for buying and selling pre-owned
                  gadgets. We believe in a future where every device gets a second life,
                  reducing electronic waste and making high-quality tech available to everyone
                  at a fair price.
                </p>
                <p>
                  Our platform bridges the gap between sellers looking to earn from their
                  used devices and buyers seeking quality tech at affordable rates. We ensure
                  secure transactions, verified product listings, and seamless logistics so that
                  customers can shop with confidence.
                </p>
                <p>
                  By embracing innovation and fostering trust within our community, ResellBD
                  aims to set new standards in the resale industry. Our commitment to transparency,
                  security, and customer satisfaction drives us to improve every aspect of our
                  platform, making it the go-to destination for all your tech resale needs.
                </p>
              </div>

              <div className="mt-6">
                <Link href="/products">
                  <Button className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold px-6 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2">
                    <span>Explore Products</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-12 sm:mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] dark:text-white">
              What Our Customers Say
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
              Ensuring the best experience for our users.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 mb-3 text-[#F59E0B]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    &ldquo;{testimonial}&rdquo;
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-[#1F2937] dark:text-white">
                    Verified Customer
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 sm:mt-16 mb-8 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
              Clear answers to the most common questions about ResellBD.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-6 shadow-xs">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={String(index)}
                  className="border-slate-100 dark:border-slate-800 last:border-b-0"
                >
                  <AccordionTrigger className="text-left font-semibold text-sm sm:text-base text-[#1F2937] dark:text-white hover:text-[#F59E0B] transition-colors py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Container>
    </div>
  );
}
