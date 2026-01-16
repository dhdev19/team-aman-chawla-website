"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVBAR_ITEMS } from "@/constants";
import { cn } from "@/lib/utils";
import { statsApi } from "@/lib/api-client";

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleNavClick = async (pageName: string) => {
    try {
      await statsApi.trackClick(pageName);
    } catch (error) {
      // Silently fail - don't interrupt user experience
      console.error("Failed to track click:", error);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2"
            onClick={() => handleNavClick("Home")}
          >
            <span className="text-2xl font-bold text-primary-700">
              Team Aman Chawla
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {NAVBAR_ITEMS.map((item) => {
              if ("submenu" in item) {
                return (
                  <div key={item.label} className="relative group">
                    <button className="px-4 py-2 text-neutral-700 hover:text-primary-700 hover:bg-neutral-50 rounded-md transition-colors">
                      {item.label}
                    </button>
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary-700 first:rounded-t-md last:rounded-b-md"
                          onClick={() => handleNavClick(subItem.label)}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 text-neutral-700 hover:text-primary-700 hover:bg-neutral-50 rounded-md transition-colors",
                    pathname === item.href && "text-primary-700 bg-primary-50"
                  )}
                  onClick={() => handleNavClick(item.label)}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-neutral-700 hover:bg-neutral-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200">
            {NAVBAR_ITEMS.map((item) => {
              if ("submenu" in item) {
                return (
                  <div key={item.label} className="py-2">
                    <div className="px-4 py-2 font-semibold text-neutral-900">
                      {item.label}
                    </div>
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        className="block px-8 py-2 text-neutral-700 hover:bg-neutral-50 hover:text-primary-700"
                        onClick={() => {
                          handleNavClick(subItem.label);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                );
              }
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "block px-4 py-2 text-neutral-700 hover:bg-neutral-50 hover:text-primary-700 rounded-md",
                    pathname === item.href && "text-primary-700 bg-primary-50"
                  )}
                  onClick={() => {
                    handleNavClick(item.label);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
