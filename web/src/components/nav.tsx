'use client'; 
import Link from "next/link";
import { Wand2, ArrowRight, History, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { useState } from "react";

export function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">VideoTransform</span>
          </Link>
        </div>

        {/* Desktop Nav
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
        </nav> */}

        {/* Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <SignedIn>
            <Link href="/history">
              <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                <History className="h-4 w-4" />
                History
              </Button>
            </Link>
            <Link href="/video-to-video">
              <Button size="sm" className="gap-2 hidden sm:flex">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="ghost" size="sm">Sign Up</Button>
            </SignUpButton>
          </SignedOut>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-primary"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t py-4 px-6 space-y-4 animate-in slide-in-from-top-10 duration-200">
          <Link
            href="/"
            className="block text-base font-medium hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <SignedIn>
            <Link
              href="/history"
              className="block text-base font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              History
            </Link>
            <Link
              href="/video-to-video"
              className="block text-base font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <span
                className="block text-base font-medium hover:text-primary cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </span>
            </SignInButton>
            <SignUpButton mode="modal">
              <span
                className="block text-base font-medium hover:text-primary cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </span>
            </SignUpButton>
          </SignedOut>
        </div>
      )}
    </header>
  );
}