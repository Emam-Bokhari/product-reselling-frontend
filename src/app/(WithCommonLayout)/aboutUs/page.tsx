"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Leaf,
  HeartHandshake,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Users,
  MapPin,
  Star,
  PhoneCall,
  ShoppingBag,
  PlusCircle,
  Home,
  Zap,
  Check,
  Search,
  MessageCircle,
  Coins,
  Percent,
} from "lucide-react";

import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

// Assets
import visionImage from "@/assets/vision.jpg";
import manWorkingImage from "@/assets/man-working.jpg";
import packagingBoxImage from "@/assets/packaging-box.jpg";

export default function AboutUsPage() {
  const [howItWorksTab, setHowItWorksTab] = useState<"buyers" | "sellers">("buyers");
  const [faqSearch, setFaqSearch] = useState("");

  // Platform statistics
  const platformStats = [
    {
      value: "50,000+",
      label: "Verified Listings",
      detail: "Laptops, phones & tech gear",
      icon: <ShoppingBag className="w-6 h-6 text-amber-600" />,
      bg: "bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60",
    },
    {
      value: "35,000+",
      label: "Satisfied Community Members",
      detail: "Active buyers & sellers across BD",
      icon: <Users className="w-6 h-6 text-blue-600" />,
      bg: "bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60",
    },
    {
      value: "64",
      label: "Districts Covered",
      detail: "Nationwide peer-to-peer delivery",
      icon: <MapPin className="w-6 h-6 text-emerald-600" />,
      bg: "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60",
    },
    {
      value: "৳ 15+ Cr",
      label: "Saved by Customers",
      detail: "Compared to brand-new showroom prices",
      icon: <Coins className="w-6 h-6 text-purple-600" />,
      bg: "bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/60",
    },
  ];

  // Core Pillars / Value proposition
  const corePillars = [
    {
      title: "Screened & Verified Listings",
      description:
        "Every listing undergoes photo authenticity checks, battery cycle verification, and serial checks to protect you from counterfeits and locked devices.",
      icon: <ShieldCheck className="w-6 h-6 text-amber-500" />,
      badge: "Quality First",
      color: "border-amber-200/80 bg-amber-50/30",
    },
    {
      title: "Zero Commission & Fair Deals",
      description:
        "Sellers keep 100% of their earnings with zero commission deductions. Buyers get transparent market-based pricing with direct negotiation.",
      icon: <Percent className="w-6 h-6 text-emerald-500" />,
      badge: "100% Free",
      color: "border-emerald-200/80 bg-emerald-50/30",
    },
    {
      title: "Eco-Friendly Circular Economy",
      description:
        "Extending the lifecycle of laptops, smartphones, and gadgets reduces hazardous e-waste in Bangladesh while preserving precious natural resources.",
      icon: <Leaf className="w-6 h-6 text-teal-500" />,
      badge: "Sustainability",
      color: "border-teal-200/80 bg-teal-50/30",
    },
    {
      title: "Dedicated Safe Meetup Guidelines",
      description:
        "We provide detailed device inspection checklists and safety protocols for local meetups and trusted courier transactions nationwide.",
      icon: <HeartHandshake className="w-6 h-6 text-blue-500" />,
      badge: "Safe Trading",
      color: "border-blue-200/80 bg-blue-50/30",
    },
  ];

  // Buyer vs Seller steps
  const buyerSteps = [
    {
      step: "01",
      title: "Search & Filter Clean Deals",
      desc: "Browse verified listings by brand, condition, location, and price. View detailed real photos and device specifications.",
      icon: <Search className="w-5 h-5 text-amber-500" />,
    },
    {
      step: "02",
      title: "Chat & Agree on Terms",
      desc: "Connect directly with verified sellers. Ask questions, request battery health proof, and negotiate fair terms without middleman fees.",
      icon: <MessageCircle className="w-5 h-5 text-amber-500" />,
    },
    {
      step: "03",
      title: "Inspect & Complete Handover",
      desc: "Meet at a safe public spot or use secure courier with inspection allowance. Verify hardware specs in hand before final payment.",
      icon: <CheckCircle2 className="w-5 h-5 text-amber-500" />,
    },
  ];

  const sellerSteps = [
    {
      step: "01",
      title: "List in Under 2 Minutes",
      desc: "Upload original photos, select your category, specify device condition, and set your desired price. Zero listing fee.",
      icon: <PlusCircle className="w-5 h-5 text-amber-500" />,
    },
    {
      step: "02",
      title: "Receive Verified Inquiries",
      desc: "Get notified as interested gadget enthusiasts contact you directly. Review buyer credibility and chat smoothly on the platform.",
      icon: <Zap className="w-5 h-5 text-amber-500" />,
    },
    {
      step: "03",
      title: "Get Paid Instantly",
      desc: "Hand over your item and receive instant payment via cash, bKash, Nagad, or bank transfer. Keep 100% of your selling price.",
      icon: <Coins className="w-5 h-5 text-amber-500" />,
    },
  ];

  // Customer testimonials
  const testimonials = [
    {
      quote:
        "Found an Apple MacBook Air M1 in mint condition for my remote programming job. The seller's battery cycle count matched the listing 100%. Saved almost ৳40,000 compared to brand new!",
      author: "Tanvir Ahmed",
      role: "Software Engineer",
      city: "Dhanmondi, Dhaka",
      product: "Purchased Apple MacBook Air M1",
      rating: 5,
    },
    {
      quote:
        "Sold my Sony Alpha mirrorless camera within 36 hours of posting. No spam calls, respectful buyers, and zero commission cuts. ResellBD is by far the cleanest re-commerce platform in BD.",
      author: "Sabrina Yasmin",
      role: "Digital Content Creator",
      city: "GEC, Chattogram",
      product: "Sold Sony Alpha A6400",
      rating: 5,
    },
    {
      quote:
        "As a university student on a strict budget, finding an iPad with Apple Pencil for note-taking felt impossible until I checked ResellBD. Transparent seller and flawless transaction.",
      author: "Mahmudul Hasan",
      role: "CSE Undergraduate",
      city: "Shahjalal U., Sylhet",
      product: "Purchased iPad Air 4th Gen",
      rating: 5,
    },
  ];

  // FAQ items
  const faqList = [
    {
      question: "How does ResellBD screen and verify product listings?",
      answer:
        "Our moderation system checks product listings for authentic physical photographs (stock photos are flagged), correct category mapping, hardware serial specifications, and fair market pricing. Additionally, buyers can inspect community ratings and transaction badges on seller profiles.",
    },
    {
      question: "Are there any hidden fees or commission cuts for sellers?",
      answer:
        "No! ResellBD is 100% free for community members. Sellers keep every single Taka of their agreed price. There are no commission cuts, hidden transaction fees, or posting charges.",
    },
    {
      question: "What payment methods are supported for buying and selling?",
      answer:
        "Buyers and sellers can settle transactions using major Bangladeshi mobile financial services (bKash, Nagad, Rocket), direct bank transfers, or cash upon physical inspection during meetups.",
    },
    {
      question: "What is ResellBD's safe meetup and inspection advice?",
      answer:
        "We strongly advise meeting in well-lit, public spaces (such as shopping malls, metro stations, or popular cafes). Take 10-15 minutes to run hardware diagnostics: check display touch response, battery health, Wi-Fi/Bluetooth, cameras, and ensure all iCloud/Google accounts are logged out before handing over money.",
    },
    {
      question: "What if a received device doesn't match the listing description?",
      answer:
        "If purchasing via platform courier with inspection allowance, you can decline acceptance on the spot if the product condition differs from the description. For dispute assistance, our support team is available via phone and email to mediate.",
    },
    {
      question: "Can I buy or sell devices outside of Dhaka?",
      answer:
        "Yes! ResellBD serves all 64 districts of Bangladesh. Many users trade locally within their district or use trusted conditional courier services (Sundarban, SA Paribahan, Steadfast) with verification options.",
    },
  ];

  const filteredFaqs = faqList.filter(
    (item) =>
      item.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      item.answer.toLowerCase().includes(faqSearch.toLowerCase())
  );

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
                  About Us
                </span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* ============================================================
            HERO BANNER
            ============================================================ */}
        <section className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8 sm:p-12 lg:p-16 overflow-hidden border border-slate-800 shadow-xl mb-14 sm:mb-20">
          {/* Ambient Lighting Accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          <div className="relative z-10 max-w-3xl">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 mb-6 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Bangladesh&apos;s Trusted Re-Commerce Marketplace</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-black tracking-tight leading-[1.15] text-white">
              Making Quality Tech Accessible &amp;{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                Sustainable for Everyone
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              ResellBD bridges the trust gap in Bangladesh&apos;s second-hand electronics market.
              We empower students, developers, and everyday gadget users to buy and sell verified
              pre-owned tech safely, directly, and with zero commission cuts.
            </p>

            {/* CTAs & Trust Badges */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/products">
                <Button className="bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold px-6 py-5 rounded-xl shadow-md transition-all cursor-pointer">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Explore Marketplace
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="outline"
                  className="border-slate-700 bg-slate-850/80 hover:bg-slate-800 text-white px-6 py-5 rounded-xl transition-all cursor-pointer"
                >
                  <Users className="w-4 h-4 mr-2 text-amber-400" />
                  Become a Member
                </Button>
              </Link>
            </div>

            {/* Quick Micro-Trust Bar */}
            <div className="mt-10 pt-8 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Screened Device Listings</span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Listing Commission</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-teal-400 shrink-0" />
                <span>E-Waste Reduction Across BD</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            METRICS / STATS BAR
            ============================================================ */}
        <section className="mb-16 sm:mb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {platformStats.map((stat, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all duration-300 group"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105 ${stat.bg}`}
                >
                  {stat.icon}
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1F2937] dark:text-white tracking-tight">
                  {stat.value}
                </h3>
                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                  {stat.label}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  {stat.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================
            OUR STORY & MISSION (LAYERED IMAGE + STORYTELLING)
            ============================================================ */}
        <section className="mb-16 sm:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left: Professional Visual Composition */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-start">
              <div className="relative w-full max-w-[480px]">
                {/* Decorative Pill Accent */}
                <div className="absolute -top-3 -right-3 w-28 h-40 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl -z-10 opacity-80" />

                {/* Primary Image */}
                <div className="relative w-[88%] h-[300px] sm:h-[380px] rounded-3xl overflow-hidden shadow-xl border-4 border-white dark:border-slate-800">
                  <Image
                    src={manWorkingImage}
                    alt="ResellBD Operations & Community"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 480px"
                  />
                </div>

                {/* Secondary Floating Image */}
                <div className="absolute -bottom-6 right-0 w-[58%] h-[200px] sm:h-[240px] rounded-3xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl">
                  <Image
                    src={packagingBoxImage}
                    alt="Verified Packaging & Gadget Delivery"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 60vw, 260px"
                  />
                </div>

                {/* Floating Rating Pill */}
                <div className="absolute -bottom-2 left-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl shadow-lg flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center font-bold">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-900 dark:text-white">
                      <span>4.9 / 5.0 Rating</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Based on 12k+ Community Deals
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Mission & Narrative */}
            <div className="lg:col-span-6 mt-6 lg:mt-0">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Our Story &amp; Mission
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1F2937] dark:text-white tracking-tight mt-2 leading-tight">
                Why We Built Bangladesh&apos;s First Community-Centric Re-Commerce Hub
              </h2>

              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mt-4">
                In Bangladesh, finding reliable second-hand tech used to be a gamble. Buyers had to
                roam crowded physical markets with no warranty, fearing counterfeit screens or
                faulty batteries. Meanwhile, honest sellers struggled with endless low-ball offers
                and middleman commission cuts.
              </p>

              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mt-3">
                We founded <strong>ResellBD</strong> to solve this permanently. By giving buyers and
                sellers transparent listings, genuine hardware photos, condition indicators, and
                direct secure chat, we created an open marketplace where tech gets a proud second
                life.
              </p>

              {/* Key Bullet Highlights */}
              <div className="space-y-3.5 mt-6 pt-6 border-t border-slate-200/80 dark:border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      100% Genuine Community Listings
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      No stock photo spam. All devices require authentic real-life captures.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      Transparent Price Discovery
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Sellers keep all earnings; buyers save up to 70% compared to showroom prices.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      Supporting Students &amp; Creators
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Making MacBook, ThinkPad, iPad, and DSLR gear affordable for emerging talent.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            THE 4 PILLARS (CORE VALUES)
            ============================================================ */}
        <section className="mb-16 sm:mb-24">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Our Core Values
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] dark:text-white tracking-tight mt-1">
              Built on Trust, Transparency &amp; Sustainability
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Every feature on ResellBD is designed around safeguarding your investments and making
              re-commerce seamless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {corePillars.map((pillar, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center border border-amber-200/60 dark:border-amber-800/60">
                      {pillar.icon}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#1F2937] dark:text-white leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <span>ResellBD Guarantee</span>
                  <CheckCircle2 className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================
            HOW RESELLBD WORKS (BUYER VS SELLER INTERACTIVE JOURNEY)
            ============================================================ */}
        <section className="mb-16 sm:mb-24 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xs">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Simple &amp; Seamless
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] dark:text-white tracking-tight mt-1">
              How ResellBD Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Whether you are looking to upgrade your setup or cash out your old gadgets, we make it
              effortless.
            </p>

            {/* Toggle Tabs */}
            <div className="inline-flex items-center p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 mt-6 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setHowItWorksTab("buyers")}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  howItWorksTab === "buyers"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-amber-500" />
                <span>For Buyers</span>
              </button>

              <button
                type="button"
                onClick={() => setHowItWorksTab("sellers")}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  howItWorksTab === "sellers"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <PlusCircle className="w-4 h-4 text-amber-500" />
                <span>For Sellers</span>
              </button>
            </div>
          </div>

          {/* 3 Step Process Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(howItWorksTab === "buyers" ? buyerSteps : sellerSteps).map((stepItem, index) => (
              <div
                key={index}
                className="relative bg-slate-50/60 dark:bg-slate-800/40 rounded-2xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 group hover:border-amber-400/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold text-sm shadow-xs">
                    {stepItem.step}
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-2xs border border-slate-200/80 dark:border-slate-700">
                    {stepItem.icon}
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#1F2937] dark:text-white mb-2">
                  {stepItem.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {stepItem.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Zap className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Free customer support available 7 days a week from 9 AM to 10 PM.</span>
            </div>

            <Link
              href={howItWorksTab === "buyers" ? "/products" : "/login"}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
            >
              <span>{howItWorksTab === "buyers" ? "Start Browsing Deals" : "List Your Gadget Now"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ============================================================
            SUSTAINABILITY & VISION BANNER (CIRCULAR ECONOMY)
            ============================================================ */}
        <section className="mb-16 sm:mb-24">
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white border border-slate-800 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              {/* Image Side */}
              <div className="lg:col-span-6 relative h-[280px] sm:h-[360px] lg:h-[440px]">
                <Image
                  src={visionImage}
                  alt="Our Vision for Sustainable Tech in Bangladesh"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent" />
                <div className="absolute bottom-6 left-6 z-10">
                  <Badge className="bg-amber-500 text-slate-950 font-bold px-3 py-1 text-xs">
                    Green Tech Initiative
                  </Badge>
                </div>
              </div>

              {/* Text Side */}
              <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Sustainable Future
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white leading-tight">
                  Reducing E-Waste, One Gadget at a Time
                </h2>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mt-3.5">
                  Electronic waste is quickly becoming one of Bangladesh&apos;s most critical
                  environmental challenges. Millions of working smartphones and computers are
                  discarded or forgotten in drawers simply because someone wanted a newer model.
                </p>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mt-3">
                  At ResellBD, we believe every functional device deserves a second and third life.
                  When you buy or sell pre-owned tech, you aren&apos;t just saving money — you are
                  actively keeping hazardous heavy metals out of our soil and rivers.
                </p>

                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800">
                  <div>
                    <h4 className="text-xl sm:text-2xl font-black text-amber-400">12,000+</h4>
                    <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                      Devices Diverted from Landfills
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xl sm:text-2xl font-black text-emerald-400">80% Less</h4>
                    <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                      Carbon Footprint vs Manufacturing
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            COMMUNITY TESTIMONIALS
            ============================================================ */}
        <section className="mb-16 sm:mb-24">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Community Voices
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] dark:text-white tracking-tight mt-1">
              Loved by Thousands Across Bangladesh
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              See how everyday students, creators, and professionals power their passions with ResellBD.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <Card
                key={index}
                className="bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all duration-300 rounded-2xl flex flex-col justify-between"
              >
                <CardContent className="p-6 sm:p-7 flex flex-col justify-between h-full">
                  <div>
                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="inline-block text-[10px] font-semibold text-amber-600 dark:text-amber-400 mb-1">
                      {t.product}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {t.author}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <span>{t.role}</span>
                      <span>•</span>
                      <span>{t.city}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ============================================================
            FAQ SECTION (SEARCHABLE ACCORDION)
            ============================================================ */}
        <section className="mb-16 sm:mb-24">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Got Questions?
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] dark:text-white tracking-tight mt-1">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                Everything you need to know about buying, selling, and safety on ResellBD.
              </p>

              {/* FAQ Search Bar */}
              <div className="relative mt-6 max-w-md mx-auto">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search questions (e.g., verification, payment, fees)..."
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* Accordion */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-6 shadow-2xs">
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border-slate-100 dark:border-slate-800">
                      <AccordionTrigger className="text-left font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-amber-600 transition-colors py-4">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No matching questions found for &ldquo;{faqSearch}&rdquo;.
                  </div>
                )}
              </Accordion>
            </div>

            <div className="text-center mt-6 text-xs text-slate-500 dark:text-slate-400">
              Have another question? Reach out to us at{" "}
              <a
                href="mailto:support@resellbd.com"
                className="text-amber-600 font-semibold hover:underline"
              >
                support@resellbd.com
              </a>{" "}
              or call{" "}
              <a href="tel:+8801315773424" className="text-amber-600 font-semibold hover:underline">
                +880 131 577 3424
              </a>
            </div>
          </div>
        </section>

        {/* ============================================================
            BOTTOM CALL TO ACTION (CTA BANNER)
            ============================================================ */}
        <section className="rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-slate-950 p-8 sm:p-12 lg:p-14 shadow-lg text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none -ml-20 -mt-20" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full blur-2xl pointer-events-none -mr-20 -mb-20" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-slate-900/80 mb-2">
              Ready to Upgrade?
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-snug">
              Join 35,000+ Gadget Enthusiasts Trading on ResellBD Today
            </h2>
            <p className="text-xs sm:text-sm text-slate-900/85 mt-3 leading-relaxed">
              Find incredible deals on certified second-hand tech or turn your unused electronics
              into instant cash without middleman fees.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/products">
                <Button className="bg-slate-950 hover:bg-slate-900 text-white font-bold px-7 py-3 rounded-xl shadow-md transition-all cursor-pointer">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Browse Products
                </Button>
              </Link>

              <Link href="/contactUs">
                <Button
                  variant="outline"
                  className="border-slate-900/40 bg-white/20 hover:bg-white/30 text-slate-950 font-bold px-7 py-3 rounded-xl transition-all cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
