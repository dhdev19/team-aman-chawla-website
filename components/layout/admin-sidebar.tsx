"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLogout } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const adminMenuItems = [
  { label: "Dashboard", href: "/admin", icon: "📊" },
  { label: "Properties", href: "/admin/properties", icon: "🏠" },
  { label: "Videos", href: "/admin/videos", icon: "🎥" },
  { label: "Blogs", href: "/admin/blogs", icon: "📝" },
  { label: "Enquiries", href: "/admin/enquiries", icon: "📧" },
  { label: "TAC Registrations", href: "/admin/tac-registrations", icon: "📋" },
  { label: "Page Stats", href: "/admin/stats", icon: "📈" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const { logout } = useLogout();

  return (
    <aside
      className={cn(
        "bg-neutral-900 text-white transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-xl font-bold text-white">Admin Panel</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-md hover:bg-neutral-800 transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isCollapsed ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {adminMenuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 px-4 py-3 rounded-md transition-colors",
              pathname === item.href || pathname.startsWith(item.href + "/")
                ? "bg-primary-700 text-white"
                : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
            )}
            title={isCollapsed ? item.label : undefined}
          >
            <span className="text-xl">{item.icon}</span>
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-neutral-800">
        <button
          onClick={logout}
          className={cn(
            "flex items-center space-x-3 w-full px-4 py-3 rounded-md text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors",
            isCollapsed && "justify-center"
          )}
          title={isCollapsed ? "Logout" : undefined}
        >
          <span className="text-xl">🚪</span>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
