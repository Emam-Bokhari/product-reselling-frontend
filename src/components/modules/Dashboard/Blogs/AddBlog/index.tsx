"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blogSchema } from "./blog.validation";
import { addBlog } from "@/services/Blog";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ArrowLeft,
  BookOpen,
  Check,
  Clock,
  FileText,
  ImageIcon,
  Loader2,
  PenTool,
  Sparkles,
  Tag,
  X,
} from "lucide-react";

const commonCategories = [
  "Safe Trading",
  "Buying Guides",
  "Selling Tips",
  "Electronics",
  "Mobiles",
  "Marketplace News",
  "Lifestyle",
];

const suggestedTags = [
  "Safety",
  "SecondHand",
  "BudgetDeals",
  "Tips",
  "Guide",
  "ReSellBD",
  "Electronics",
];

export default function AddBlogForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const form = useForm({
    defaultValues: {
      title: "",
      thumbnail: "",
      category: "",
      authorName: "",
      introduction: "",
      mainContent: "",
      tags: [] as string[],
    },
    resolver: zodResolver(blogSchema),
  });

  const thumbnailVal = form.watch("thumbnail");
  const mainContentVal = form.watch("mainContent") || "";
  const tagsVal = form.watch("tags") || [];

  // Estimate reading time
  const wordCount = mainContentVal.trim()
    ? mainContentVal.trim().split(/\s+/).length
    : 0;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // Tag helper
  const addTag = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim().replace(/^#/, "");
    if (!trimmed) return;
    if (!tagsVal.includes(trimmed)) {
      form.setValue("tags", [...tagsVal, trimmed]);
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    form.setValue(
      "tags",
      tagsVal.filter((t) => t !== tagToRemove)
    );
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await addBlog(data);
      if (response?.success) {
        toast.success("Blog article published successfully!");
        router.push("/admin/dashboard/blogs");
      } else {
        toast.error(response?.error?.[0]?.message || "Failed to create article");
      }
    } catch {
      toast.error("Something went wrong while publishing article!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Top Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-zinc-800 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold ring-1 ring-amber-500/20">
                  <BookOpen className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Create New Blog Post
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Publish insightful articles, safe-trading tips, and community buying guides.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <Button
                type="button"
                variant="outline"
                asChild
                className="h-10 px-4 rounded-xl text-xs font-semibold border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                <Link href="/admin/dashboard/blogs" className="flex items-center gap-1.5">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Cancel / Back</span>
                </Link>
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-10 px-5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md hover:shadow-amber-500/25 transition-all cursor-pointer flex items-center gap-1.5 border border-amber-400/60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Publish Article</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Form Fields (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Card 1: Article Header Details */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200/80 dark:border-zinc-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80 pb-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-500" />
                    Article Information
                  </h3>
                  <span className="text-[11px] text-muted-foreground font-medium">
                    Basic post metadata
                  </span>
                </div>

                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                        Article Title <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. 5 Smart Tips for Buying Used Electronics Safely"
                          className="h-11 rounded-xl bg-slate-50/60 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs sm:text-sm px-4 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category & Author Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                          Category <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g. Buying Guides, Safety"
                            className="h-11 rounded-xl bg-slate-50/60 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs sm:text-sm px-4 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                          />
                        </FormControl>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {commonCategories.slice(0, 4).map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => form.setValue("category", c)}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-amber-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 transition-colors"
                            >
                              +{c}
                            </button>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Author Name */}
                  <FormField
                    control={form.control}
                    name="authorName"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                          Author Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g. Tanvir Ahmed or ReSellBD Editorial"
                            className="h-11 rounded-xl bg-slate-50/60 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs sm:text-sm px-4 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Card 2: Article Content */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200/80 dark:border-zinc-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80 pb-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <PenTool className="w-4 h-4 text-amber-500" />
                    Article Content
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span>{wordCount} words</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-500" />
                      ~{readTimeMinutes} min read
                    </span>
                  </div>
                </div>

                {/* Introduction */}
                <FormField
                  control={form.control}
                  name="introduction"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                        Introduction / Summary <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="A compelling 2-3 sentence overview that highlights what readers will learn..."
                          rows={3}
                          className="rounded-xl bg-slate-50/60 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs sm:text-sm p-4 leading-relaxed focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-y"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Main Content */}
                <FormField
                  control={form.control}
                  name="mainContent"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                        Main Article Body <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Write the full comprehensive content here. Feel free to structure with paragraphs, bullet points, and section titles..."
                          rows={12}
                          className="rounded-xl bg-slate-50/60 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs sm:text-sm p-4 leading-relaxed focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-y"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Card 3: Tags & Discoverability */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200/80 dark:border-zinc-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80 pb-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-500" />
                    Tags & Discoverability
                  </h3>
                  <span className="text-[11px] text-muted-foreground font-medium">
                    Help users discover your post
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag(tagInput);
                        }
                      }}
                      placeholder="Type a tag and press Enter or Add..."
                      className="h-10 rounded-xl bg-slate-50/60 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs sm:text-sm"
                    />
                    <Button
                      type="button"
                      onClick={() => addTag(tagInput)}
                      variant="outline"
                      className="h-10 px-4 rounded-xl text-xs font-semibold"
                    >
                      Add Tag
                    </Button>
                  </div>

                  {/* Active Tags */}
                  {tagsVal.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-xl bg-slate-50/80 dark:bg-zinc-800/40 border border-slate-200/60 dark:border-zinc-700/60">
                      {tagsVal.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800/80 text-xs pl-2.5 pr-1.5 py-1 rounded-lg gap-1.5"
                        >
                          <span>#{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:bg-amber-200 dark:hover:bg-amber-900/80 rounded-full p-0.5 text-amber-700 dark:text-amber-300"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Suggested Quick Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-muted-foreground font-medium mr-1">
                      Suggestions:
                    </span>
                    {suggestedTags.map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => addTag(st)}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 hover:bg-amber-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-600 hover:text-amber-600 dark:text-zinc-300 transition-colors"
                      >
                        +{st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Visuals & Publishing Details (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Thumbnail Card */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-xs border border-slate-200/80 dark:border-zinc-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80 pb-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-500" />
                    Cover Thumbnail
                  </h3>
                  <span className="text-[11px] text-red-500 font-bold">*Required</span>
                </div>

                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                        Image URL
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="https://images.unsplash.com/..."
                          className="h-10 rounded-xl bg-slate-50/60 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Live Preview Box */}
                <div className="relative w-full aspect-video rounded-xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 overflow-hidden flex items-center justify-center">
                  {thumbnailVal ? (
                    <Image
                      src={thumbnailVal}
                      alt="Thumbnail Preview"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        // fallback on broken image
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-1.5 p-4 text-center">
                      <ImageIcon className="w-8 h-8 text-slate-400" />
                      <p className="text-xs font-semibold text-slate-500">
                        No image URL provided
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Paste an image URL above to preview your article header
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Editorial Best Practices Card */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-xs border border-slate-200/80 dark:border-zinc-800 space-y-3.5">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Editorial Checklist
                </div>
                <div className="space-y-2.5 text-xs text-muted-foreground leading-relaxed">
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                    <span>Clear, actionable titles get 3x higher click-throughs.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                    <span>Summarize the main insight in the opening 2 sentences.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                    <span>High quality 16:9 images look best across mobile and desktop.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                    <span>Categorize accurately for community search indexing.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
