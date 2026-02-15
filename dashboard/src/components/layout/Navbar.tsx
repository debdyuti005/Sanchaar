"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    Home,
    LayoutDashboard,
    GitBranch,
    Brain,
    Share2,
    BarChart3,
    Menu,
    X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/pipeline", label: "Pipeline", icon: GitBranch },
    { href: "/agents", label: "Agents", icon: Brain },
    { href: "/distribution", label: "Distribution", icon: Share2 },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

export function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-white/5 bg-[#030712]/80 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-3">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <motion.div
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-white font-bold text-sm shadow-lg shadow-violet-600/20"
                        whileHover={{ rotate: 5, scale: 1.08 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        S
                    </motion.div>
                    <div>
                        <h1 className="text-sm font-semibold text-white tracking-tight group-hover:text-violet-300 transition-colors">
                            Sanchaar
                        </h1>
                        <p className="text-[10px] text-zinc-500 -mt-0.5">
                            Content Supply Chain
                        </p>
                    </div>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <motion.div
                                    className={cn(
                                        "relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm transition-colors",
                                        isActive
                                            ? "text-white"
                                            : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
                                    )}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <item.icon className="h-4 w-4" />
                                    <span className="font-medium">{item.label}</span>
                                    {isActive && (
                                        <motion.div
                                            className="absolute inset-x-2 -bottom-3 h-0.5 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full"
                                            layoutId="navbar-indicator"
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Status + Mobile toggle */}
                <div className="flex items-center gap-3">
                    <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-zinc-500 bg-white/5 border border-white/5 rounded-full px-3 py-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Bedrock Connected
                    </div>
                    <button
                        className="md:hidden text-zinc-400"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile nav */}
            {mobileOpen && (
                <motion.nav
                    className="md:hidden border-t border-white/5 bg-[#030712]/95 backdrop-blur-xl px-6 py-4 space-y-1"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                >
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                            >
                                <div
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm",
                                        isActive
                                            ? "text-white bg-white/5"
                                            : "text-zinc-400 hover:text-white hover:bg-white/[0.03]"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </div>
                            </Link>
                        );
                    })}
                </motion.nav>
            )}
        </header>
    );
}
