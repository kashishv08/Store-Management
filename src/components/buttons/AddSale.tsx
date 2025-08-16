"use client";
import React, { useState } from "react";
import { Product } from "../../../generated/prisma";
import { gqlClient } from "@/lib/service/gql";
import { CREATE_SALE } from "@/lib/gql/mutation";
import { useRouter } from "next/navigation";
import { Button, TextField } from "@radix-ui/themes";

function AddSale({ product }: { product: Product }) {
  const [quant, setQuant] = useState("1");
  // const [error, setError] = useState("");
  const router = useRouter();

  const handleSale = async () => {
    if (product.stock < parseInt(quant)) {
      // setError("quant is less");
      alert("quant is less");
      return;
    }

    try {
      if (!quant) {
        // setError("Add Quantity to add Sale");
        return;
      }
      const data = await gqlClient.request(CREATE_SALE, {
        createSaleId: product.id,
        quantity: parseInt(quant),
      });
      setQuant("");
      router.refresh();
    } catch (e: any) {
      console.log(e.message);
    }
  };
  return (
    // AddSale.tsx
    <div className="mt-6 flex gap-3 items-center">
      <TextField.Root
        type="number"
        min={1}
        max={product.stock}
        value={quant}
        onChange={(e) => setQuant(e.target.value)}
        className="flex-1"
        placeholder="Quantity"
      />
      <Button
        onClick={handleSale}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        Add to Sale
      </Button>
    </div>
  );
}

export default AddSale;
