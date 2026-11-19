import React from "react";
import Image from "next/image";
import Link from "next/link";
import moment from "moment-timezone";
import { Calendar, MessageSquare } from "lucide-react";
import { TBlog } from "@/types";

export default function BlogCard({ blog }: { blog: TBlog }) {
  const { _id, title, thumbnail, category, introduction, createdAt } =
    blog || {};

  const formattedDate = createdAt
    ? moment(createdAt).format("D MMM YYYY")
    : "12 Aug 2024";

  // Interaction/comment count (from data or consistent value)
  const commentCount =
    blog && "comments" in blog && Array.isArray((blog as { comments?: unknown[] }).comments)
      ? (blog as { comments: unknown[] }).comments.length
      : ((_id ? _id.charCodeAt(_id.length - 1) : 45) % 40 + 25);

  const blogImage =
    thumbnail ||
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop";

  return (
    <div className="group relative w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      {/* Top Image */}
      <Link
        href={`/blogs/${_id}`}
        className="relative w-full h-48 sm:h-52 bg-slate-100 dark:bg-slate-800 overflow-hidden block"
      >
        <Image
          src={blogImage}
          alt={title || "Blog thumbnail"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>

      {/* Card Content & Footer */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between">
        {/* Main Content Area */}
        <div>
          {/* Category */}
          <span className="block text-xs sm:text-sm font-semibold text-[#F59E0B] hover:text-[#D97706] transition-colors capitalize">
            {category || "Business"}
          </span>

          {/* Title */}
          <Link href={`/blogs/${_id}`} className="block">
            <h3 className="text-base sm:text-lg font-bold text-[#1F2937] dark:text-white leading-snug mt-2 group-hover:text-[#F59E0B] transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>

          {/* Excerpt / Introduction */}
          <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed mt-2.5 line-clamp-3">
            {introduction ||
              "Making money online is attainable. However, even if the processes are simple, you may still need help with issues."}
          </p>
        </div>

        {/* Footer Meta: Date & Comments */}
        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{formattedDate}</span>
          </div>

          <span className="text-slate-300 dark:text-slate-600 font-bold">•</span>

          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{commentCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
