"use client";
import { DEL_PRODUCT } from "@/lib/gql/mutation";
import { gqlClient } from "@/lib/service/gql";
import { Button } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { UserContext } from "../context/user-context";
import { MdDeleteOutline } from "react-icons/md";

function DeleteProd({ id }: { id: string }) {
  const router = useRouter();
  const { user } = useContext(UserContext);

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
  return (
    <>
      {(user?.role == "admin" || user?.role == "manager") && (
        <button
          onClick={handleDelProduct}
          className="cursor-pointer p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 
             active:bg-red-200 transition-all duration-200 focus:ring-2 focus:ring-red-300"
        >
          <MdDeleteOutline size={20} className="cursor-pointer" />
        </button>
      )}
    </>
  );
}

export default DeleteProd;
