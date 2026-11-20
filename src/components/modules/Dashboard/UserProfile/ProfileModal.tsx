"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { IUser } from "@/types";
import { updateProfile } from "@/services/User";
import {
  Edit3,
  Globe,
  Home,
  ImageIcon,
  Loader2,
  MapPin,
  Save,
  User,
} from "lucide-react";
import { FaFacebook } from "react-icons/fa6";

export default function ProfileModal({
  profile,
  onSave,
}: {
  profile: IUser;
  onSave: (updateProfile: Partial<IUser>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    identifier: profile?.identifier || "",
    profilePicture: profile?.profilePicture || "",
    city: profile?.city || "",
    address: profile?.address || "",
    postalCode: profile?.postalCode || "",
    country: profile?.country || "",
    gender: profile?.gender || "",
    bio: profile?.bio || "",
    facebook: profile?.facebook || "",
    website: profile?.website || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenderChange = (value: "male" | "female") => {
    setFormData({ ...formData, gender: value });
  };

  const handleSubmit = async () => {
    const isValidURL = (url: string) => {
      if (!url) return true;
      const regex = /^(https?:\/\/)?([\w.-]+\.[a-z]{2,})(\/\S*)?$/i;
      return regex.test(url);
    };

    if (
      !isValidURL(formData.profilePicture) ||
      !isValidURL(formData.facebook) ||
      !isValidURL(formData.website)
    ) {
      toast.error(
        "Please enter valid URLs for Profile Picture, Facebook, and Website!"
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await updateProfile(formData);

      if (data?.success) {
        toast.success("Profile updated successfully!");
        onSave(formData);
        setOpen(false);
      } else {
        toast.error(data?.error?.[0]?.message || "Failed to update profile");
      }
    } catch {
      toast.error("Network error while updating profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-10 px-5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold shadow-md shadow-amber-500/20 cursor-pointer flex items-center gap-2 transition-all">
          <Edit3 className="w-4 h-4" />
          <span>Edit Profile</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[95vw] md:max-w-[650px] p-6 rounded-3xl border-slate-200 dark:border-zinc-800">
        <DialogHeader className="pb-3 border-b border-slate-100 dark:border-zinc-800">
          <DialogTitle className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-[#F59E0B]" />
            <span>Update Profile Information</span>
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Manage your personal specifications, residential address, and social links.
          </p>
        </DialogHeader>

        {/* Scrollable Form Body */}
        <div className="max-h-[70vh] overflow-y-auto space-y-4 pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Full Name
              </Label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="pl-9 h-10 rounded-xl bg-slate-50/60 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]"
                />
              </div>
            </div>

            {/* Profile Picture URL */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Avatar Image URL
              </Label>
              <div className="relative">
                <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  name="profilePicture"
                  value={formData.profilePicture}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="pl-9 h-10 rounded-xl bg-slate-50/60 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]"
                />
              </div>
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                City / District
              </Label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Dhaka, Chittagong"
                  className="pl-9 h-10 rounded-xl bg-slate-50/60 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]"
                />
              </div>
            </div>

            {/* Postal Code */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Postal Code
              </Label>
              <Input
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="e.g. 1205"
                className="h-10 rounded-xl bg-slate-50/60 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]"
              />
            </div>

            {/* Country */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Country
              </Label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="e.g. Bangladesh"
                  className="pl-9 h-10 rounded-xl bg-slate-50/60 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]"
                />
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Gender
              </Label>
              <Select
                onValueChange={handleGenderChange}
                value={formData.gender}
              >
                <SelectTrigger className="h-10 rounded-xl bg-slate-50/60 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Facebook URL */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Facebook Profile URL
              </Label>
              <div className="relative">
                <FaFacebook className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  name="facebook"
                  type="url"
                  value={formData.facebook}
                  onChange={handleChange}
                  placeholder="https://facebook.com/username"
                  className="pl-9 h-10 rounded-xl bg-slate-50/60 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]"
                />
              </div>
            </div>

            {/* Website URL */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Personal Website / Portfolio
              </Label>
              <div className="relative">
                <Globe className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://yourwebsite.com"
                  className="pl-9 h-10 rounded-xl bg-slate-50/60 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]"
                />
              </div>
            </div>

            {/* Address - Full width */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Residential Address
              </Label>
              <div className="relative">
                <Home className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House, Road, Area details"
                  className="pl-9 h-10 rounded-xl bg-slate-50/60 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]"
                />
              </div>
            </div>

            {/* Bio - Full width */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Bio / Seller Introduction
              </Label>
              <Textarea
                name="bio"
                rows={3}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Share a short bio or details about your trading presence on ReSellBD..."
                className="rounded-xl bg-slate-50/60 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs p-3 focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] resize-y"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex justify-end">
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="h-10 px-6 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold cursor-pointer transition-all flex items-center gap-2 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
