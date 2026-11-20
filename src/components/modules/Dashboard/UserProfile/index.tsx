"use client";

import { useState } from "react";
import Image from "next/image";
import yellowShadeImage from "@/assets/yellow-shade-bg.jpg";
import {
  Building2,
  Calendar,
  ExternalLink,
  FileText,
  Globe,
  Hash,
  Home,
  Mail,
  MapPin,
  Shield,
  User,
  UserCheck,
} from "lucide-react";
import { FaFacebook } from "react-icons/fa6";
import { IUser } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ProfileModal from "./ProfileModal";

export default function UserProfile({ profileData }: { profileData: IUser }) {
  const [profile, setProfile] = useState<IUser>(profileData);

  const handleSave = async (updatedFields: Partial<IUser>) => {
    setProfile((prev) => ({
      ...prev,
      ...updatedFields,
      updatedAt: new Date().toISOString(),
    }));
  };

  const joinedDate = profile?.createdAt
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(profile.createdAt))
    : "Member";

  const lastUpdatedDate = profile?.updatedAt
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(profile.updatedAt))
    : null;

  return (
    <div className="space-y-6">
      {/* Hero Header Card */}
      <div className="relative rounded-3xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        {/* Ambient Brand Cover Banner */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-950">
          <Image
            src={yellowShadeImage}
            alt="Profile Banner"
            fill
            priority
            className="object-cover opacity-50 mix-blend-screen scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-amber-950/70" />
        </div>

        {/* Identity & Actions Bar */}
        <div className="relative px-6 sm:px-8 pb-6 pt-3 sm:pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            {/* Left: Avatar & Primary info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              {/* Profile Avatar */}
              <div className="relative -mt-16 sm:-mt-20 w-28 h-28 sm:w-32 sm:h-32 rounded-3xl ring-4 ring-white dark:ring-zinc-900 bg-white dark:bg-zinc-800 shadow-xl overflow-hidden shrink-0 flex items-center justify-center z-10">
                {profile?.profilePicture ? (
                  <Image
                    src={profile.profilePicture}
                    alt={profile.name || "User Profile Picture"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-extrabold uppercase shadow-inner">
                    {profile?.name ? profile.name.charAt(0) : "U"}
                  </div>
                )}
              </div>

              {/* Name & Quick Identifiers */}
              <div className="space-y-1.5 pt-1 sm:pt-0">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {profile?.name || "Community Member"}
                </h1>

                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-500 dark:text-zinc-400 flex-wrap">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-zinc-300">
                    <Mail className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                    <span>{profile?.identifier || "No email linked"}</span>
                  </span>

                  {profile?.city && (
                    <>
                      <span className="text-slate-300 dark:text-zinc-700">•</span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          {profile.city}
                          {profile?.country ? `, ${profile.country}` : ""}
                        </span>
                      </span>
                    </>
                  )}

                  {profile?.createdAt && (
                    <>
                      <span className="text-slate-300 dark:text-zinc-700">•</span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Member since {joinedDate}</span>
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Profile Modal Trigger */}
            <div className="sm:self-center pt-2 sm:pt-0 shrink-0">
              <ProfileModal profile={profile} onSave={handleSave} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Bio, Social Presence & Account Details */}
        <div className="space-y-6">
          {/* About / Bio Card */}
          <Card className="rounded-2xl border-slate-200/80 dark:border-zinc-800 shadow-xs bg-white dark:bg-zinc-900">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-zinc-800/80">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#F59E0B]" />
                <span>About Seller</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {profile?.bio ? (
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                  {profile.bio}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground italic leading-relaxed">
                  No personal bio added yet. Click &quot;Edit Profile&quot; to introduce yourself and provide trading details to other buyers and sellers on ReSellBD.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Social Links Card */}
          <Card className="rounded-2xl border-slate-200/80 dark:border-zinc-800 shadow-xs bg-white dark:bg-zinc-900">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-zinc-800/80">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#F59E0B]" />
                <span>Connected Links</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Public social links & web profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {/* Facebook */}
              {profile?.facebook ? (
                <a
                  href={
                    profile.facebook.startsWith("http")
                      ? profile.facebook
                      : `https://${profile.facebook}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/60 hover:border-blue-500/50 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <FaFacebook className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-semibold text-slate-800 dark:text-zinc-200">
                        Facebook
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate max-w-[140px]">
                        Connected
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                </a>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 dark:bg-zinc-800/30 border border-dashed border-slate-200 dark:border-zinc-800 text-xs opacity-75">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-400 flex items-center justify-center shrink-0">
                      <FaFacebook className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-600 dark:text-zinc-400">
                        Facebook
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Not linked
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                    Empty
                  </span>
                </div>
              )}

              {/* Personal Website */}
              {profile?.website ? (
                <a
                  href={
                    profile.website.startsWith("http")
                      ? profile.website
                      : `https://${profile.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/60 hover:border-emerald-500/50 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 transition-all text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-semibold text-slate-800 dark:text-zinc-200">
                        Personal Website
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate max-w-[140px]">
                        Connected
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
                </a>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 dark:bg-zinc-800/30 border border-dashed border-slate-200 dark:border-zinc-800 text-xs opacity-75">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-400 flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-600 dark:text-zinc-400">
                        Personal Website
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Not linked
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                    Empty
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Overview Metadata */}
          <Card className="rounded-2xl border-slate-200/80 dark:border-zinc-800 shadow-xs bg-white dark:bg-zinc-900">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-zinc-800/80">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#F59E0B]" />
                <span>Account Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Account Status</span>
                <span className="font-semibold text-emerald-600 capitalize">
                  {profile?.status || "Active"}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-semibold text-slate-800 dark:text-zinc-200">
                  {joinedDate}
                </span>
              </div>
              {lastUpdatedDate && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="font-semibold text-slate-800 dark:text-zinc-200">
                      {lastUpdatedDate}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Personal & Location Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information Card */}
          <Card className="rounded-2xl border-slate-200/80 dark:border-zinc-800 shadow-xs bg-white dark:bg-zinc-900">
            <CardHeader className="pb-4 border-b border-slate-100 dark:border-zinc-800/80">
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#F59E0B]" />
                <span>Personal Information</span>
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                Your personal details and identification parameters on ReSellBD.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Legal Name */}
                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-700/60 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#F59E0B]" />
                    Full Legal Name
                  </span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {profile?.name || (
                      <span className="text-muted-foreground font-normal italic">
                        Not specified
                      </span>
                    )}
                  </p>
                </div>

                {/* Primary Email */}
                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-700/60 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#F59E0B]" />
                    Primary Email
                  </span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white break-all">
                    {profile?.identifier || (
                      <span className="text-muted-foreground font-normal italic">
                        Not specified
                      </span>
                    )}
                  </p>
                </div>

                {/* Gender */}
                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-700/60 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#F59E0B]" />
                    Gender
                  </span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                    {profile?.gender || (
                      <span className="text-muted-foreground font-normal italic">
                        Gender not specified
                      </span>
                    )}
                  </p>
                </div>

                {/* System Role */}
                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-700/60 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#F59E0B]" />
                    Account Role
                  </span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                    {profile?.role === "admin"
                      ? "System Administrator"
                      : "Verified User"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location & Address Information Card */}
          <Card className="rounded-2xl border-slate-200/80 dark:border-zinc-800 shadow-xs bg-white dark:bg-zinc-900">
            <CardHeader className="pb-4 border-b border-slate-100 dark:border-zinc-800/80">
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#F59E0B]" />
                <span>Location & Residential Address</span>
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                Used for order fulfillment, local pick-up, and trade verification.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* City */}
                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-700/60 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#F59E0B]" />
                    City / District
                  </span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {profile?.city || (
                      <span className="text-muted-foreground font-normal italic">
                        Not set
                      </span>
                    )}
                  </p>
                </div>

                {/* Postal Code */}
                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-700/60 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-[#F59E0B]" />
                    Postal Code
                  </span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {profile?.postalCode || (
                      <span className="text-muted-foreground font-normal italic">
                        Not set
                      </span>
                    )}
                  </p>
                </div>

                {/* Country */}
                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-700/60 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#F59E0B]" />
                    Country
                  </span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {profile?.country || "Bangladesh"}
                  </p>
                </div>
              </div>

              {/* Detailed Address */}
              <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-700/60 space-y-1">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-[#F59E0B]" />
                  Full Residential Address
                </span>
                <p className="text-sm font-medium text-slate-800 dark:text-zinc-200">
                  {profile?.address || (
                    <span className="text-muted-foreground font-normal italic">
                      No detailed street address provided yet.
                    </span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
