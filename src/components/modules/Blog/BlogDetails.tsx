"use client";

import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import moment from "moment-timezone";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  Tag,
  Share2,
  Copy,
  Check,
  ArrowLeft,
  ArrowRight,
  Home,
  Quote,
  BookOpen,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
  Facebook,
  Twitter,
  MessageCircle,
} from "lucide-react";

import Container from "@/components/shared/Container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import BlogCard from "@/components/ui/core/BlogCard";
import { TBlog } from "@/types";

interface BlogDetailsProps {
  blog: TBlog;
  relatedBlogs?: TBlog[];
}

export default function BlogDetails({ blog, relatedBlogs = [] }: BlogDetailsProps) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  // Format publication date
  const formattedDate = useMemo(() => {
    return blog?.createdAt
      ? moment(blog.createdAt).format("DD MMMM YYYY")
      : "Recent";
  }, [blog?.createdAt]);

  // Estimated reading time
  const readingTime = useMemo(() => {
    const text = `${blog?.introduction || ""} ${blog?.mainContent || ""}`.trim();
    if (!text) return 1;
    const wordCount = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 180));
  }, [blog?.introduction, blog?.mainContent]);

  // Split content into clean paragraphs
  const paragraphs = useMemo(() => {
    if (!blog?.mainContent) return [];
    return blog.mainContent
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
  }, [blog?.mainContent]);

  // Copy link handler
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Article link copied to clipboard!");
      setTimeout(() => setCopied(false), 2200);
    }
  };

  // Thumbnail image with fallback
  const thumbnailSrc =
    blog?.thumbnail ||
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop";

  // If blog is not found
  if (!blog) {
    return (
      <Container className="py-20 text-center">
        <div className="max-w-md mx-auto p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200/60 dark:border-amber-800/60">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Blog Post Not Found
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            The article you are looking for may have been removed, renamed, or is temporarily unavailable.
          </p>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white text-sm font-semibold transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Blogs</span>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <article className="min-h-screen bg-slate-50/50 dark:bg-slate-950/20">
      <Container className="py-6 sm:py-8 lg:py-10">
        {/* ============================================================
            TOP BREADCRUMB & BACK NAVIGATION
            ============================================================ */}
        <div className="mb-6 sm:mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
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
                <BreadcrumbLink asChild>
                  <Link
                    href="/blogs"
                    className="text-xs sm:text-sm text-slate-500 hover:text-[#F59E0B] transition-colors"
                  >
                    Blogs
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {blog.category && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <span className="text-xs sm:text-sm font-medium text-amber-600 dark:text-amber-400 capitalize">
                      {blog.category}
                    </span>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>

          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-[#F59E0B] transition-colors py-1.5 px-3 rounded-lg hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Blogs</span>
          </Link>
        </div>

        {/* ============================================================
            ARTICLE HEADER SECTION
            ============================================================ */}
        <header className="max-w-4xl">
          {/* Category Badge & Read Time */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/40 text-[#D97706] dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/80 shadow-2xs">
              <Tag className="w-3 h-3" />
              {blog.category || "General"}
            </span>

            <span className="text-slate-300 dark:text-slate-700">•</span>

            <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{readingTime} min read</span>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold text-[#1F2937] dark:text-white leading-[1.25] sm:leading-[1.2] tracking-tight">
            {blog.title}
          </h1>

          {/* Author & Publication Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 mt-6 border-y border-slate-200/80 dark:border-slate-800">
            {/* Author Avatar & Info */}
            <div className="flex items-center gap-3.5">
              <Avatar className="w-11 h-11 border-2 border-amber-500/20 shadow-xs">
                <AvatarImage
                  src="https://res.cloudinary.com/dvpqm6zct/image/upload/v1742736505/user_ug5gxm.png"
                  alt={blog.authorName || "Author"}
                />
                <AvatarFallback className="bg-amber-100 text-amber-800 font-bold text-sm">
                  {blog.authorName ? blog.authorName.charAt(0).toUpperCase() : "A"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#1F2937] dark:text-slate-100">
                    {blog.authorName || "ResellBD Author"}
                  </span>
                  <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                    Author
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Published on {formattedDate}</span>
                  </div>
                </div>
              </div>
            </div>

          
          </div>
        </header>

        {/* ============================================================
            HERO FEATURED IMAGE (THUMBNAIL)
            ============================================================ */}
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] max-h-[480px] rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-800 my-6 sm:my-8 group">
          <Image
            src={thumbnailSrc}
            alt={`${blog.title} - thumbnail image`}
            fill
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-102"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
          {blog.category && (
            <div className="absolute top-4 left-4 z-10">
              <Badge className="bg-slate-900/80 backdrop-blur-md text-white border-white/20 text-xs px-3 py-1 font-semibold capitalize shadow-xs">
                {blog.category}
              </Badge>
            </div>
          )}
        </div>

        {/* ============================================================
            MAIN CONTENT & SIDEBAR 2-COLUMN LAYOUT
            ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-8 sm:mt-10">
          {/* ------------------------------------------------------------
              LEFT COLUMN: ARTICLE CONTENT (8 COLS)
              ------------------------------------------------------------ */}
          <div className="lg:col-span-8 space-y-8">
            {/* Introduction / Key Takeaway Callout Box */}
            {blog.introduction && (
              <div className="relative p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-amber-50/80 via-amber-50/40 to-transparent dark:from-amber-950/30 dark:via-transparent border-l-4 border-[#F59E0B] shadow-2xs">
                <Quote className="w-10 h-10 text-amber-500/20 absolute top-4 right-4 pointer-events-none" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#D97706] mb-2 flex items-center gap-1.5">
                  Key Overview
                </h4>
                <p className="text-base sm:text-lg text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {blog.introduction}
                </p>
              </div>
            )}

            {/* Main Content Paragraphs */}
            <div className="space-y-6 text-[#374151] dark:text-slate-300 text-base sm:text-[17px] leading-relaxed sm:leading-8">
              {paragraphs.length > 0 ? (
                paragraphs.map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="leading-relaxed">{blog.mainContent}</p>
              )}
            </div>

            {/* Tags Section */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mr-2">
                    <Tag className="w-3.5 h-3.5 text-amber-500" />
                    Tags:
                  </span>
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 border border-slate-200/90 dark:border-slate-800 transition-colors shadow-2xs"
                    >
                      <span className="text-amber-500 font-bold mr-1">#</span>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Sharing Banner */}
         

            {/* Author Bio Box */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <Avatar className="w-16 h-16 border-2 border-amber-500/30 shrink-0">
                <AvatarImage
                  src="https://res.cloudinary.com/dvpqm6zct/image/upload/v1742736505/user_ug5gxm.png"
                  alt={blog.authorName || "Author"}
                />
                <AvatarFallback className="text-xl font-bold bg-amber-100 text-amber-800">
                  {blog.authorName ? blog.authorName.charAt(0).toUpperCase() : "A"}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left flex-grow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">
                      Written by
                    </span>
                    <h4 className="text-lg font-bold text-[#1F2937] dark:text-white">
                      {blog.authorName || "ResellBD Author"}
                    </h4>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium self-center sm:self-auto">
                    Verified Contributor
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Sharing actionable insights, verified market advice, and buying/selling guides for used electronics and gadgets in Bangladesh.
                </p>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-amber-600 hover:border-amber-300 text-sm font-semibold transition-all shadow-2xs hover:shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>All Articles</span>
              </Link>

              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white text-sm font-semibold transition-all shadow-xs hover:shadow-sm"
              >
                <span>Browse Used Products</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* ------------------------------------------------------------
              RIGHT COLUMN: STICKY SIDEBAR (4 COLS)
              ------------------------------------------------------------ */}
          <div className="lg:col-span-4 space-y-6">
            {/* 1. ResellBD Marketplace Promo Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white shadow-sm border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
              <div className="relative z-10">
                <span className="inline-block text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2">
                  ResellBD Marketplace
                </span>
                <h3 className="text-lg font-bold leading-snug">
                  Buy &amp; Sell Used Gadgets Safely in Bangladesh
                </h3>
                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  Looking for quality second-hand smartphones, laptops, or electronics? Browse verified listings or sell your old device with ease.
                </p>

                <div className="space-y-2 mt-4 pt-4 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Verified community listings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Best prices on pre-owned tech</span>
                  </div>
                </div>

                <div className="mt-5">
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors shadow-xs"
                  >
                    <span>Explore Products</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* 2. Quick Share Post Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-amber-500" />
                Share this post
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copied ? "Copied" : "Copy Link"}</span>
                </button>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    currentUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <Facebook className="w-3.5 h-3.5 text-blue-600" />
                  <span>Facebook</span>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    currentUrl
                  )}&text=${encodeURIComponent(blog.title || "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <Twitter className="w-3.5 h-3.5 text-sky-500" />
                  <span>Twitter</span>
                </a>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `${blog.title || ""} ${currentUrl}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* 3. Recent Articles Sidebar List */}
            {relatedBlogs && relatedBlogs.length > 0 && (
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-500" />
                    Latest Articles
                  </h4>
                  <Link
                    href="/blogs"
                    className="text-[11px] font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    View All
                  </Link>
                </div>
                <div className="space-y-4">
                  {relatedBlogs.slice(0, 3).map((item) => (
                    <Link
                      key={item._id}
                      href={`/blogs/${item._id}`}
                      className="group flex gap-3 items-center"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-200/80">
                        <Image
                          src={
                            item.thumbnail ||
                            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=200&auto=format&fit=crop"
                          }
                          alt={item.title || "Blog thumbnail"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <span className="text-[11px] font-semibold text-amber-600 capitalize line-clamp-1">
                          {item.category || "Article"}
                        </span>
                        <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug mt-0.5">
                          {item.title}
                        </h5>
                        <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{moment(item.createdAt).format("D MMM YYYY")}</span>
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================
            RELATED ARTICLES BOTTOM SECTION
            ============================================================ */}
        {relatedBlogs && relatedBlogs.length > 0 && (
          <section className="mt-16 sm:mt-20 pt-12 border-t border-slate-200/80 dark:border-slate-800">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  Keep Reading
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#1F2937] dark:text-white mt-1">
                  Related Articles
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Discover more buying guides, resale insights, and gadget tips.
                </p>
              </div>

              <Link
                href="/blogs"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors group"
              >
                <span>View all articles</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBlogs.slice(0, 3).map((item) => (
                <BlogCard key={item._id} blog={item} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </article>
  );
}
