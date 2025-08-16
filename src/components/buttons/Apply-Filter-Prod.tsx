"use client";
import { gqlClient } from "@/lib/service/gql";
import {
  Box,
  Button,
  Dialog,
  Flex,
  Select,
  Text,
  TextField,
  Tooltip,
} from "@radix-ui/themes";
import { useState } from "react";
import { TbFilterHeart } from "react-icons/tb";
import { Product } from "../../../generated/prisma";
import { FILTER_PROD } from "@/lib/gql/queries";

function ApplyFilter({
  setProducts,
}: {
  setProducts: (value: Product[]) => void;
}) {
  const [cat, setCat] = useState("");
  const [order, setOrder] = useState("asc");
  const [inp, setInp] = useState("");

  const handleFilter = async () => {
    const prod: {
      filterProd: Product[];
    } = await gqlClient.request(FILTER_PROD, {
      orderBy: order,
      category: cat,
      input: inp,
    });
    console.log(prod.filterProd);
    setProducts(prod.filterProd);
  };
  return (
    <Box className="w-full flex items-center gap-4">
      <Flex direction="row" gap="2" className="m-[10px]">
        <TextField.Root
          className="flex-1 max-w-sm"
          placeholder="Search products..."
          value={inp}
          onChange={(e) => setInp(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleFilter();
          }}
        ></TextField.Root>

        <Dialog.Root>
          <Dialog.Trigger>
            <Button variant="soft" size="2" className="rounded-xl">
              <TbFilterHeart size={22} />
              <Text ml="2">Filters</Text>
            </Button>
          </Dialog.Trigger>

          <Dialog.Content maxWidth="450px" className="rounded-xl">
            <Dialog.Title className="text-xl mb-2">Apply Filters</Dialog.Title>

            <Flex direction="column" gap="4">
              <Box>
                <Text
                  as="label"
                  size="2"
                  weight="medium"
                  style={{ marginRight: "20px" }}
                >
                  Category
                </Text>
                <Select.Root defaultValue="others" onValueChange={setCat}>
                  <Select.Trigger className="mt-1" />
                  <Select.Content>
                    <Select.Group>
                      <Select.Item value="electronics">Electronics</Select.Item>
                      <Select.Item value="beauty">Beauty</Select.Item>
                      <Select.Item value="food">Food</Select.Item>
                      <Select.Item value="accessories">Accessories</Select.Item>
                      <Select.Item value="clothing">Clothing</Select.Item>
                      <Select.Item value="furniture">Furniture</Select.Item>
                      <Select.Item value="decor">Decor</Select.Item>
                      <Select.Item value="others">Others</Select.Item>
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
              </Box>

              <Box>
                <Text
                  as="label"
                  size="2"
                  weight="medium"
                  style={{ marginRight: "20px" }}
                >
                  Sort by Price
                </Text>
                <Select.Root defaultValue="asc" onValueChange={setOrder}>
                  <Select.Trigger className="mt-1" />
                  <Select.Content>
                    <Select.Group>
                      <Select.Item value="asc">Low to High</Select.Item>
                      <Select.Item value="desc">High to Low</Select.Item>
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
              </Box>
            </Flex>

            <Flex gap="3" mt="5" justify="end" align="center">
              <Dialog.Close>
                <Button color="gray">Cancel</Button>
              </Dialog.Close>
              <Dialog.Close>
                <Button onClick={handleFilter}>Apply</Button>
              </Dialog.Close>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </Flex>
    </Box>
  );
}

export default ApplyFilter;
