"use client";
import { ALL_PROD } from "@/lib/gql/queries";
import { gqlClient } from "@/lib/service/gql";
import {
  Badge,
  Box,
  Card,
  Flex,
  Heading,
  ScrollArea,
  Spinner,
  Text,
} from "@radix-ui/themes";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import AddProduct from "./buttons/AddProduct";
import ApplyFilter from "./buttons/Apply-Filter-Prod";
import { UserContext } from "./context/user-context";
import { Product } from "generated/prisma";

function AllProducts() {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleProd = async () => {
      const data: { getAllProd: Product[] } = await gqlClient.request(ALL_PROD);
      const prod = data?.getAllProd || [];
      setProducts(prod);
      setLoading(false);
    };
    handleProd();
  }, []);

  if (loading) {
    return (
      <div className="text-white min-h-screen w-full justify-center items-center ml-[50%] mt-[40%]">
        <Spinner size="3" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3 h-full relative p-4">
      <div className="sticky top-23">
        <div className="flex items-center mb-3">
          <h2 className="text-white text-1xl font-bold mr-[20px]">
            All Products
          </h2>
          {(user?.role === "admin" || user?.role === "manager") && (
            <AddProduct products={products} setProducts={setProducts} />
          )}
        </div>
        <hr />
        <ApplyFilter setProducts={setProducts} />
      </div>

      <div className="overflow-y-auto pb-20 mt-20 scrollbar-custom">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
            <Text size="4" className="text-gray-400">
              No products found.
            </Text>
            {user?.role === "admin" || user?.role === "manager" ? (
              <Text size="3" className="text-gray-400 mt-2">
                Click "Add Product" to add new products.
              </Text>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((val) => (
              <Card
                key={val.id}
                className="bg-gray-800 rounded-lg shadow flex flex-col overflow-hidden"
              >
                <Link href={`/prod/${val.id}`}>
                  <div className="w-full h-48">
                    <img
                      src={val.imageUrl || "/product.jpg"}
                      alt={val.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </Link>

                <Box className="p-3 flex flex-col gap-1 flex-grow">
                  <Flex justify="between" align="center">
                    <Heading size="5" className="text-white truncate">
                      {val.title}
                    </Heading>
                    <Badge size="2" color="orange">
                      {val.category}
                    </Badge>
                  </Flex>

                  <Text
                    size="3"
                    className="text-gray-300 truncate line-clamp-1"
                  >
                    {val.description}
                  </Text>

                  <Flex justify="between" align="center" className="mt-1">
                    <Text size="4" weight="bold" className="text-green-500">
                      ${val.price}
                    </Text>
                    <Badge
                      size="2"
                      color={val.stock > 0 ? "green" : "red"}
                      className="capitalize"
                    >
                      {val.stock > 0 ? `${val.stock} in stock` : "Out of stock"}
                    </Badge>
                  </Flex>
                </Box>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllProducts;
