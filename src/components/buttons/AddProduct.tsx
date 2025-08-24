"use client";
import { ADD_PROD } from "@/lib/gql/mutation";
import { gqlClient } from "@/lib/service/gql";
import { BiCartAdd } from "react-icons/bi";
import {
  Button,
  Dialog,
  Flex,
  Select,
  Text,
  TextField,
} from "@radix-ui/themes";
import React, { useState } from "react";
import { Product } from "../../../generated/prisma";
import { useRouter } from "next/navigation";

function AddProduct() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [cat, setCat] = useState("others");
  const [price, setPrice] = useState("99.9");
  const [stock, setStock] = useState("1");
  const [image, setImage] = useState("");
  const router = useRouter();

  const handleAddProd = async () => {
    const prod: {
      addProduct: Product;
    } = await gqlClient.request(ADD_PROD, {
      title,
      description: desc,
      category: cat,
      price: Number.parseFloat(price),
      stock: Number.parseInt(stock),
      imageUrl: image,
    });
    if (prod.addProduct) {
      router.refresh();
    } else {
      alert(":/");
    }
  };

  return (
    <div>
      <Dialog.Root>
        <Dialog.Trigger>
          <button className="px-3 inline-flex border p-1 border-white rounded-2xl bg-blue-900 gap-2 cursor-pointer">
            <BiCartAdd size={23} />
            <span className="hidden md:block">Product</span>
          </button>
        </Dialog.Trigger>

        <Dialog.Content maxWidth="450px">
          <Dialog.Title>Add Product</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Make changes to your profile.
          </Dialog.Description>

          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Title
              </Text>
              <TextField.Root
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Description
              </Text>
              <TextField.Root
                placeholder="Enter Desc.."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Price
              </Text>
              <TextField.Root
                placeholder="Enter price"
                value={price}
                type="number"
                onChange={(e) => setPrice(e.target.value)}
              />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Stock
              </Text>
              <TextField.Root
                placeholder="Enter stock"
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Image
              </Text>
              <TextField.Root
                placeholder="Enter image url"
                value={image}
                type="url"
                onChange={(e) => setImage(e.target.value)}
              />
            </label>
            <Select.Root defaultValue="others" onValueChange={setCat}>
              <Select.Trigger />
              <Select.Content>
                <Select.Group>
                  <Select.Label>Category</Select.Label>
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
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button onClick={handleAddProd}>Save</Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}

export default AddProduct;
