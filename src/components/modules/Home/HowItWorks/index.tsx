import Container from "@/components/shared/Container";
import {
  ShoppingBag,
  MessageSquareText,
  ShieldCheck,
  Truck,
  ArrowRight,
  ArrowDown,
} from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Find Your Product",
    description:
      "Browse thousands of verified pre-loved items and select the one that fits your needs and budget.",
    tag: "Search & Filter",
    icon: ShoppingBag,
    iconColor: "text-amber-500 dark:text-amber-400",
    iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
    ringHover: "group-hover:from-amber-400 group-hover:via-amber-500 group-hover:to-orange-400",
    badgeBg: "bg-gradient-to-r from-amber-500 to-amber-600",
    arrowColor: "text-amber-500",
  },
  {
    step: "02",
    title: "Connect & Confirm",
    description:
      "Contact the seller directly, discuss product details, negotiate price, and finalize your deal.",
    tag: "Direct Chat",
    icon: MessageSquareText,
    iconColor: "text-sky-500 dark:text-sky-400",
    iconBg: "bg-sky-500/10 dark:bg-sky-500/20",
    ringHover: "group-hover:from-sky-400 group-hover:via-sky-500 group-hover:to-blue-500",
    badgeBg: "bg-gradient-to-r from-sky-500 to-blue-600",
    arrowColor: "text-sky-500",
  },
  {
    step: "03",
    title: "Secure Payment",
    description:
      "Make safe and protected transactions through our trusted payment options with buyer protection.",
    tag: "100% Protected",
    icon: ShieldCheck,
    iconColor: "text-emerald-500 dark:text-emerald-400",
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    ringHover: "group-hover:from-emerald-400 group-hover:via-emerald-500 group-hover:to-teal-500",
    badgeBg: "bg-gradient-to-r from-emerald-500 to-teal-600",
    arrowColor: "text-emerald-500",
  },
  {
    step: "04",
    title: "Get It Delivered",
    description:
      "Receive your product at your doorstep quickly and smoothly through a reliable delivery service.",
    tag: "Doorstep Delivery",
    icon: Truck,
    iconColor: "text-rose-500 dark:text-rose-400",
    iconBg: "bg-rose-500/10 dark:bg-rose-500/20",
    ringHover: "group-hover:from-rose-400 group-hover:via-rose-500 group-hover:to-orange-400",
    badgeBg: "bg-gradient-to-r from-rose-500 to-orange-500",
    arrowColor: "text-rose-500",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="my-14 sm:my-20">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1F2937] dark:text-white tracking-tight">
            How ReSellBD <span className="text-[#F59E0B]">Works</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-2 max-w-lg mx-auto leading-relaxed">
            Buy and sell pre-loved goods in 4 straightforward and transparent steps across Bangladesh.
          </p>
        </div>

        {/* Connected Process Flow */}
        <div className="relative">
          {/* Desktop Horizontal Connecting Line (lg+) */}
          <div className="hidden lg:block absolute top-[56px] left-[12.5%] right-[12.5%] h-0.5 -z-0 pointer-events-none">
            <div className="w-full h-full border-t-2 border-dashed border-amber-300/80 dark:border-amber-500/30" />
          </div>

          {/* Desktop Directional Flow Arrow Badges between steps */}
          <div
            className="hidden lg:flex items-center justify-center absolute top-[56px] -translate-y-1/2 left-[25%] -translate-x-1/2 w-7 h-7 rounded-full bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700 shadow-sm z-0 text-amber-500"
            title="Next step"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
          <div
            className="hidden lg:flex items-center justify-center absolute top-[56px] -translate-y-1/2 left-[50%] -translate-x-1/2 w-7 h-7 rounded-full bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-700 shadow-sm z-0 text-sky-500"
            title="Next step"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
          <div
            className="hidden lg:flex items-center justify-center absolute top-[56px] -translate-y-1/2 left-[75%] -translate-x-1/2 w-7 h-7 rounded-full bg-white dark:bg-slate-900 border border-emerald-200 dark:border-slate-700 shadow-sm z-0 text-emerald-500"
            title="Next step"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </div>

          {/* Steps Grid / Responsive Container */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-6 relative z-10">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={step.step}
                  className="relative group flex flex-row lg:flex-col items-start lg:items-center text-left lg:text-center gap-5 sm:gap-6 lg:gap-4"
                >
                  {/* Mobile/Tablet Vertical Connecting Line (hidden on lg) */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden absolute left-[40px] sm:left-[48px] top-[80px] sm:top-[96px] bottom-[-32px] sm:bottom-[-40px] -translate-x-1/2 w-0.5 border-l-2 border-dashed border-amber-300/80 dark:border-amber-500/30 -z-0">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-center text-amber-500">
                        <ArrowDown className="w-2.5 h-2.5" />
                      </div>
                    </div>
                  )}

                  {/* Circular / Rounded Node */}
                  <div className="relative flex-shrink-0 z-10">
                    {/* Outer Rounded Ring with hover gradient */}
                    <div
                      className={`w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full p-1 bg-gradient-to-tr from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 ${step.ringHover} shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-105`}
                    >
                      {/* Middle Solid Base */}
                      <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center p-2">
                        {/* Inner Icon Circle */}
                        <div
                          className={`w-full h-full rounded-full flex items-center justify-center ${step.iconBg} ${step.iconColor} transition-transform duration-300 group-hover:scale-105`}
                        >
                          <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9" />
                        </div>
                      </div>
                    </div>

                    {/* Numbered Step Bubble */}
                    <div
                      className={`absolute -top-1 -right-1 sm:top-0 sm:right-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full ${step.badgeBg} text-white font-extrabold text-xs flex items-center justify-center shadow-md ring-2 ring-white dark:ring-slate-900`}
                    >
                      {step.step}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 pt-1 lg:pt-0">
                    {/* Step Tag Pill */}
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mb-2">
                      <span>{step.tag}</span>
                    </div>

                    {/* Step Title */}
                    <h3 className="text-base sm:text-lg font-bold text-[#1F2937] dark:text-white group-hover:text-[#F59E0B] transition-colors">
                      {step.title}
                    </h3>

                    {/* Step Description */}
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-1 leading-relaxed max-w-xs lg:mx-auto">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
