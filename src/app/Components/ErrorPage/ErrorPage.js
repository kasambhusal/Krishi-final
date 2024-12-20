"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home and reset URL
    router.push("/", { replace: true });
  }, [router]);

  return null;
}
