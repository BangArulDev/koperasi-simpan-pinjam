"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/");
      } else if (profile && profile.role === "admin") {
        router.push("/admin/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, router, user, profile]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || (profile && profile.role === "admin")) {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-100">{children}</main>
    </>
  );
}
