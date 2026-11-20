"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { TProduct } from "@/types";
import { updateProductById } from "@/services/Product";
import { districts } from "@/constants/districts";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Check,
  Edit3,
  ImageIcon,
  Loader2,
  MapPin,
  Phone,
  Plus,
  Tag,
  Trash2,
} from "lucide-react";

const conditionOptions = [
  { value: "new", label: "New" },
  { value: "likeNew", label: "Like New" },
  { value: "used", label: "Used" },
  { value: "refurbished", label: "Refurbished" },
];

const categoryOptions = [
  { value: "mobiles", label: "Mobiles" },
  { value: "electronics", label: "Electronics" },
  { value: "vehicles", label: "Vehicles" },
  { value: "property", label: "Property" },
  { value: "home", label: "Home & Living" },
  { value: "cloths", label: "Fashion & Cloths" },
  { value: "sports", label: "Sports" },
  { value: "pets", label: "Pets" },
];

const negotiableOptions = [
  { value: "yes", label: "Yes (Negotiable)" },
  { value: "no", label: "Fixed Price" },
];

const locationOptions = districts.map((value) => ({
  value: value,
  label: value.replace(/\b\w/g, (char) => char.toUpperCase()),
}));

export default function UpdateProductForm({ product }: { product: TProduct }) {
  const router = useRouter();
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      title: product?.title || "",
      description: product?.description || "",
      price: product?.price ? String(product.price) : "",
      condition: product?.condition || "used",
      category: product?.category || "",
      brand: product?.brand || "",
      location: product?.location || "",
      negotiable: product?.negotiable || "yes",
      warranty: product?.warranty || "",
      contactNumber: product?.contactNumber || "",
      images:
        product?.images && product.images.length > 0
          ? product.images.map((img) => ({ value: img }))
          : [{ value: "" }],
    },
  });

  const {
    append: appendImage,
    remove: removeImage,
    fields: imageFields,
  } = useFieldArray({
    control: form.control,
    name: "images",
  });

  const addImageField = () => {
    appendImage({ value: "" });
    setActivePreviewIndex(imageFields.length);
  };

  const currentImages = form.watch("images") || [];
  const activeImageSrc = currentImages[activePreviewIndex]?.value?.trim() || "";

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsSubmitting(true);
    const images = data.images
      .map((image: { value: string }) => image.value.trim())
      .filter(Boolean);

    const modifiedData = {
      ...data,
      images,
      price: parseFloat(data.price),
    };

    try {
      const response = await updateProductById(product._id, modifiedData);
      if (response?.success) {
        toast.success("Product listing updated successfully!");
        router.push("/user/dashboard/products");
      } else {
        toast.error(
          response?.error?.[0]?.message ||
            response?.message ||
            "Failed to update product"
        );
      }
    } catch {
      toast.error("Network error while updating product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Top Header Bar with Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-zinc-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center font-bold">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Edit Product Listing
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Update specifications, photos, and pricing for this product.
                  </p>
                </div>
              </div>
            </div>

            {/* Header Right Action Buttons */}
            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <Button
                type="button"
                variant="outline"
                asChild
                className="h-10 px-4 rounded-xl text-xs font-semibold border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                <Link
                  href="/user/dashboard/products"
                  className="flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Cancel / Back</span>
                </Link>
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-10 px-6 rounded-xl text-xs font-bold bg-[#F59E0B] hover:bg-[#D97706] text-white shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Save Changes</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Main 2-Column Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: General Information, Pricing, Warranty */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              {/* Card 1: General Information */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200/80 dark:border-zinc-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80 pb-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    General Information
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Basic product details
                  </span>
                </div>

                {/* Name Product */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                        Product Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. iPhone 13 Pro 128GB Pacific Blue"
                          className="h-11 rounded-xl bg-slate-50/60 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs sm:text-sm px-4 focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description Product */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                        Product Description <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Provide details regarding condition, accessories included, reason for selling..."
                          rows={5}
                          className="rounded-xl bg-slate-50/60 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs sm:text-sm p-4 leading-relaxed focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] resize-y"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Condition and Negotiable Pills */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-slate-100 dark:border-zinc-800/80">
                  {/* Condition Selector */}
                  <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <div>
                          <FormLabel className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                            Condition <span className="text-red-500">*</span>
                          </FormLabel>
                          <p className="text-[11px] text-slate-400">
                            Pick item condition
                          </p>
                        </div>
                        <FormControl>
                          <div className="flex flex-wrap items-center gap-2">
                            {conditionOptions.map((opt) => {
                              const isSelected = field.value === opt.value;
                              return (
                                <button
                                  type="button"
                                  key={opt.value}
                                  onClick={() => field.onChange(opt.value)}
                                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                    isSelected
                                      ? "bg-[#F59E0B] hover:bg-[#D97706] text-white shadow-xs font-bold border border-[#F59E0B]"
                                      : "bg-slate-100 hover:bg-slate-200/80 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Negotiable Toggle */}
                  <FormField
                    control={form.control}
                    name="negotiable"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <div>
                          <FormLabel className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                            Price Negotiable <span className="text-red-500">*</span>
                          </FormLabel>
                          <p className="text-[11px] text-slate-400">
                            Allow buyer bargaining
                          </p>
                        </div>
                        <FormControl>
                          <div className="flex flex-wrap items-center gap-2">
                            {negotiableOptions.map((opt) => {
                              const isSelected = field.value === opt.value;
                              return (
                                <button
                                  type="button"
                                  key={opt.value}
                                  onClick={() => field.onChange(opt.value)}
                                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                    isSelected
                                      ? "bg-[#F59E0B] hover:bg-[#D97706] text-white shadow-xs font-bold border border-[#F59E0B]"
                                      : "bg-slate-100 hover:bg-slate-200/80 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Card 2: Pricing And Details */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200/80 dark:border-zinc-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80 pb-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Pricing And Details
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Financials & Location
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Price */}
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                          Base Pricing (BDT) <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-[#F59E0B]">
                              ৳
                            </span>
                            <Input
                              {...field}
                              type="number"
                              placeholder="4750"
                              className="pl-8 h-11 rounded-xl bg-slate-50/60 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs sm:text-sm font-semibold focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Contact Number */}
                  <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                          Contact Phone <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <Input
                              {...field}
                              placeholder="01712345678"
                              className="pl-9 h-11 rounded-xl bg-slate-50/60 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs sm:text-sm focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Brand */}
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                          Brand (Optional)
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <Input
                              {...field}
                              placeholder="e.g. Apple, Sony, Zara, Honda"
                              className="pl-9 h-11 rounded-xl bg-slate-50/60 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs sm:text-sm focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Location / District */}
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                          Location / District <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11 rounded-xl bg-slate-50/60 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs sm:text-sm">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                <SelectValue placeholder="Select District" />
                              </div>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60 rounded-xl">
                            {locationOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Card 3: Warranty Coverage */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200/80 dark:border-zinc-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80 pb-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Warranty & Protection
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Optional Guarantee
                  </span>
                </div>

                <FormField
                  control={form.control}
                  name="warranty"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                        Warranty Coverage Details
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="e.g. 6 months official warranty remaining with original box and invoice memo."
                          rows={3}
                          className="rounded-xl bg-slate-50/60 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs sm:text-sm p-4 leading-relaxed focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] resize-y"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Bottom Action Submit Row */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  className="h-11 px-5 rounded-xl text-xs font-semibold border-slate-200 hover:bg-slate-100"
                >
                  <Link
                    href="/user/dashboard/products"
                    className="flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Cancel & Back</span>
                  </Link>
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 px-7 rounded-xl text-sm font-bold bg-[#F59E0B] hover:bg-[#D97706] text-white shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Save Changes</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Right Column: Upload Img, Category, Tips */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-6">
              {/* Card 4: Upload Img */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200/80 dark:border-zinc-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80 pb-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      Upload Img
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Cover photo & product gallery
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#D97706]">
                    {imageFields.length}{" "}
                    {imageFields.length === 1 ? "Photo" : "Photos"}
                  </span>
                </div>

                {/* Big Main Featured Preview Box */}
                <div className="relative w-full h-[260px] sm:h-[300px] rounded-2xl bg-slate-100/90 dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/80 overflow-hidden flex items-center justify-center group">
                  {activeImageSrc ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activeImageSrc}
                        alt="Product Preview"
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-white">
                        {activePreviewIndex === 0
                          ? "Cover Photo"
                          : `Photo #${activePreviewIndex + 1}`}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                      <div className="w-14 h-14 rounded-2xl bg-white/80 dark:bg-zinc-700/60 shadow-xs flex items-center justify-center text-slate-400">
                        <ImageIcon className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                          No Photo Preview
                        </p>
                        <p className="text-[11px] text-slate-400 max-w-[200px] leading-relaxed">
                          Paste a direct image link below to preview the item
                          photo here.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Thumbnails Row with [+] Button */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Gallery Thumbnails
                  </span>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {imageFields.map((fieldItem, idx) => {
                      const imgVal = currentImages[idx]?.value?.trim() || "";
                      const isActive = activePreviewIndex === idx;

                      return (
                        <div
                          key={fieldItem.id}
                          onClick={() => setActivePreviewIndex(idx)}
                          className={`relative w-16 h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition-all shrink-0 ${
                            isActive
                              ? "border-[#F59E0B] ring-2 ring-[#F59E0B]/30 shadow-xs"
                              : "border-slate-200 dark:border-zinc-700 hover:border-slate-300"
                          } bg-slate-100 dark:bg-zinc-800 flex items-center justify-center`}
                        >
                          {imgVal ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={imgVal}
                              alt={`Thumbnail ${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold">
                              #{idx + 1}
                            </span>
                          )}

                          {imageFields.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(idx);
                                if (
                                  activePreviewIndex >= idx &&
                                  activePreviewIndex > 0
                                ) {
                                  setActivePreviewIndex(activePreviewIndex - 1);
                                }
                              }}
                              className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity"
                              title="Delete Photo"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}

                    {/* [+] Add Thumbnail Button */}
                    <button
                      type="button"
                      onClick={addImageField}
                      className="w-16 h-16 rounded-xl border-2 border-dashed border-[#F59E0B] bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 text-[#D97706] flex flex-col items-center justify-center transition-all cursor-pointer group shrink-0"
                      title="Add Another Photo"
                    >
                      <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Direct Image URL Inputs */}
                <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-zinc-800/80">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                      Image URLs <span className="text-red-500">*</span>
                    </FormLabel>
                    <button
                      type="button"
                      onClick={addImageField}
                      className="text-xs font-bold text-[#F59E0B] hover:text-[#D97706] flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Link
                    </button>
                  </div>

                  <div className="space-y-2">
                    {imageFields.map((imageField, index) => (
                      <FormField
                        key={imageField.id}
                        control={form.control}
                        name={`images.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder={`Photo ${index + 1} URL (https://...)`}
                                  className="h-10 rounded-xl bg-slate-50/60 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs px-3 focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]"
                                  onFocus={() => setActivePreviewIndex(index)}
                                />
                              </FormControl>
                              {imageFields.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeImage(index)}
                                  className="h-10 w-10 text-slate-400 hover:text-red-600 shrink-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 5: Category */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200/80 dark:border-zinc-800 space-y-4">
                <div className="border-b border-slate-100 dark:border-zinc-800/80 pb-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Category
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Assign your item to the right market category
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                        Product Category <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-xl bg-slate-50/60 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs sm:text-sm font-medium">
                            <SelectValue placeholder="Select Product Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          {categoryOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
