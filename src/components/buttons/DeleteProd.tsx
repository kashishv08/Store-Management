"use client";
import { DEL_PRODUCT } from "@/lib/gql/mutation";
import { gqlClient } from "@/lib/service/gql";
import { Button } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import React from "react";

function DeleteProd({ id }: { id: string }) {
  const router = useRouter();
  const handleDelProduct = async () => {
    const delProd: {
      deleteProduct: boolean;
    } = await gqlClient.request(DEL_PRODUCT, {
      id,
    });
    if (delProd.deleteProduct) {
      router.refresh();
    } else {
      alert(":/");
    }
  };
  return <Button onClick={handleDelProduct}>Delete</Button>;
}

export default DeleteProd;
