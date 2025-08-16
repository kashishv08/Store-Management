import { ONE_PROD } from "@/lib/gql/queries";
import { gqlClient } from "@/lib/service/gql";
import React, { useState } from "react";
import { Product, Sale } from "../../../../../generated/prisma";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
} from "@radix-ui/themes";
import ProductSaleChart from "@/components/ProductSaleChart";
import AddSale from "@/components/buttons/AddSale";
import BackButton from "@/components/buttons/BackButton";

type p = Promise<{ id: string }>;

export default async function page({ params }: { params: p }) {
  const { id } = await params;

  const data: {
    getProdById: Product & { Sale: Sale[] };
  } = await gqlClient.request(ONE_PROD, {
    getProdByIdId: id,
  });

  const prod = data.getProdById;

  const chartData =
    prod.Sale?.map((s) => {
      const date = new Date(Number(s.createdAt));
      const format = `${date.getDate()}-${
        date.getMonth() + 1
      }-${date.getFullYear()}`;
      return {
        date: format,
        quantity: s.quantity,
      };
    }) || [];
  console.log(chartData);

  const finalData: { date: string; quantity: number }[] = [];
  chartData.forEach((val) => {
    const sale = finalData.find((v) => v.date == val.date);
    if (sale) {
      sale.quantity += val.quantity;
    } else {
      finalData.push({ ...val });
    }
  });

  return (
    <div className="min-h-screen w-full p-8 ">
      <BackButton />
      <div className="flex flex-col lg:flex-row gap-8">
        <Card className="shadow-lg rounded-2xl w-full lg:w-1/2 p-6">
          <Flex direction="column" gap="4">
            <img
              src={prod?.imageUrl || "/product.jpg"}
              className="h-64 w-full object-cover rounded-xl"
              alt={prod.title}
            />

            <div className="flex justify-between items-center">
              <Heading size="5" className="truncate">
                {prod.title}
              </Heading>
              <Badge color="orange" size="3">
                {prod.category}
              </Badge>
            </div>

            <Text size="4" className="text-gray-600">
              {prod.description}
            </Text>

            <div>
              <Text weight="bold" size="3">
                Price: &nbsp;
                <span className="text-green-600 text-lg">${prod.price}</span>
              </Text>
              <br /> <br />
              Stock: &nbsp;
              <Text
                className={`font-semibold text-lg ${
                  prod.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {prod.stock > 0 ? `${prod.stock} available` : "Out of stock"}
              </Text>
            </div>

            <AddSale product={prod} />
          </Flex>
        </Card>

        {chartData.length > 0 && (
          <Card className="shadow-lg rounded-2xl w-full lg:w-1/2 p-6">
            <Heading size="4" className="mb-4">
              Sales Trend
            </Heading>
            <div className="h-80 mt-[4rem]">
              <ProductSaleChart chartData={finalData} />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
