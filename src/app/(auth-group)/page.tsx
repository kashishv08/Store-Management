"use client";
import Admin from "@/components/Admin";
import React, { Suspense } from "react";

export default function Home() {
  // const Admin = React.lazy(() => import("@/components/Admin"));

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-40 mt-23">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <span className="ml-2 text-blue-600">Loading...</span>
        </div>
      }
    >
      <Admin />
    </Suspense>
  );
}
