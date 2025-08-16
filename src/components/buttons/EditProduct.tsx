"use client";
import { ADD_PROD, EDIT_PRODUCT } from "@/lib/gql/mutation";
import { gqlClient } from "@/lib/service/gql";
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

function EditProduct({ product }: { product: Product }) {
  const [title, setTitle] = useState(product.title);
  const [desc, setDesc] = useState(product.description);
  const [cat, setCat] = useState<string>(product.category);
  const [price, setPrice] = useState<number | string>(product.price);
  const [stock, setStock] = useState<number | string>(product.stock);
  const [image, setImage] = useState(product.imageUrl);
  const router = useRouter();

  const handleEditProd = async () => {
    const prod: {
      editProduct: Product;
    } = await gqlClient.request(EDIT_PRODUCT, {
      id: product.id,
      title: title || product.title,
      description: desc || product.description,
      category: cat || product.category,
      price: Number(price || product.price),
      stock: Number(stock || product.stock),
      imageUrl: image || product.imageUrl,
    });
    console.log(prod);
    if (prod.editProduct) {
      router.refresh();
    } else {
      alert(":/");
    }
  };

  return (
    <div>
      <Dialog.Root>
        <Dialog.Trigger>
          <Button style={{ width: "70px" }}>Edit</Button>
        </Dialog.Trigger>

        <Dialog.Content maxWidth="450px">
          <Dialog.Title>Edit Product</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Make changes in Product.
          </Dialog.Description>

          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Title
              </Text>
              <TextField.Root
                placeholder="Enter your title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Description
              </Text>
              <TextField.Root
                placeholder="Enter your title"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Price
              </Text>
              <TextField.Root
                placeholder="Enter your title"
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
                placeholder="Enter your title"
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
                placeholder="Enter your title"
                value={image}
                type="url"
                onChange={(e) => setImage(e.target.value)}
              />
            </label>
            <Select.Root defaultValue={product.category} onValueChange={setCat}>
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
              <Button onClick={handleEditProd}>Save</Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}

export default EditProduct;
