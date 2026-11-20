"use client";

import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export default function NotificationMenu() {
  // Purely dynamic - no fake hardcoded notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-full h-9 w-9 hover:bg-slate-100 dark:hover:bg-zinc-800"
          aria-label="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 sm:w-88 p-0 rounded-2xl shadow-xl border-slate-200 dark:border-zinc-800"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              Notifications
            </span>
            {unreadCount > 0 && (
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-xs px-1.5 py-0"
              >
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-10 px-6 text-center flex flex-col items-center justify-center space-y-2">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Bell className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                No New Notifications
              </p>
              <p className="text-[11px] text-muted-foreground max-w-[220px] leading-relaxed">
                Order alerts and account updates will appear here in real time.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-zinc-800/60">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 flex items-start gap-3 transition-colors hover:bg-slate-50 dark:hover:bg-zinc-800/40 cursor-pointer ${
                    !item.read ? "bg-amber-500/[0.03]" : ""
                  }`}
                  onClick={() => {
                    setNotifications((prev) =>
                      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
                    );
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {item.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  {!item.read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 self-center" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <DropdownMenuSeparator className="m-0" />
        <div className="p-2.5 text-center bg-slate-50/60 dark:bg-zinc-900/60 rounded-b-2xl">
          <span className="text-[11px] text-muted-foreground font-medium">
            ReSellBD Activity Center
          </span>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
