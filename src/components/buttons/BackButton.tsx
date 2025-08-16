"use client";
import { useRouter } from "next/navigation";
import { Button } from "@radix-ui/themes";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      size="2"
      style={{ marginBottom: "1rem" }}
    >
      ← Back
    </Button>
  );
}
