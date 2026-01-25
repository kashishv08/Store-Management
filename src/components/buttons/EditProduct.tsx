"use client";
import { EDIT_PRODUCT } from "@/lib/gql/mutation";
import { gqlClient } from "@/lib/service/gql";
import {
  Button,
  Dialog,
  Flex,
  Select,
  Text,
  TextField,
} from "@radix-ui/themes";
import React, { useContext, useState } from "react";
import { Product } from "generated/prisma";
import { UserContext } from "../context/user-context";
import { MdEdit } from "react-icons/md";
import { useRouter } from "next/navigation";

function EditProduct({ product }: { product: Product }) {
  const [title, setTitle] = useState(product.title);
  const [desc, setDesc] = useState(product.description);
  const [cat, setCat] = useState<string>(product.category);
  const [price, setPrice] = useState<number | string>(product.price);
  const [stock, setStock] = useState<number | string>(product.stock);
  const [image, setImage] = useState(product.imageUrl);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const { user } = useContext(UserContext);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    // Title: required, at least 3 chars, not only numbers
    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (/^\d+$/.test(title.trim())) {
      newErrors.title = "Title cannot be only numbers";
    }

    // Description: required, at least 10 chars
    if (!desc.trim()) {
      newErrors.desc = "Description is required";
    } else if (desc.trim().length < 10) {
      newErrors.desc = "Description must be at least 10 characters";
    }

    // Price: required, positive number
    if (price === "" || isNaN(Number(price))) {
      newErrors.price = "Price must be a valid number";
    } else if (Number(price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    // Stock: required, positive integer
    if (stock === "" || isNaN(Number(stock))) {
      newErrors.stock = "Stock must be a valid number";
    } else if (!Number.isInteger(Number(stock))) {
      newErrors.stock = "Stock must be an integer";
    } else if (Number(stock) <= 0) {
      newErrors.stock = "Stock must be greater than 0";
    }

    // Image: required, must be valid URL
    if (!image.trim()) {
      newErrors.image = "Image URL is required";
    } else {
      try {
        new URL(image.trim()); // Will throw if invalid
      } catch {
        newErrors.image = "Enter a valid URL for the image";
      }
    }

    // Category: required, must be from allowed list
    const allowedCategories = [
      "electronics",
      "beauty",
      "food",
      "accessories",
      "clothing",
      "furniture",
      "decor",
      "others",
    ];
    if (!cat.trim()) {
      newErrors.cat = "Category is required";
    } else if (!allowedCategories.includes(cat)) {
      newErrors.cat = "Invalid category selected";
    }

    return newErrors;
  };

  const handleEditProd = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const prod: { editProduct: Product } = await gqlClient.request(
      EDIT_PRODUCT,
      {
        id: product.id,
        title,
        description: desc,
        category: cat,
        price: Number(price),
        stock: Number(stock),
        imageUrl: image,
      }
    );

    if (prod.editProduct) {
      setOpen(false);
      router.refresh();
      // window.location.href = `/prod/${product.id}`;
    }
  };

  return (
    <>
      {(user?.role == "admin" || user?.role == "manager") && (
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger>
            <button
              className="cursor-pointer p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 
              active:bg-blue-200 transition-all duration-200 focus:ring-2 focus:ring-blue-300"
            >
              <MdEdit size={20} />
            </button>
          </Dialog.Trigger>

          <Dialog.Content maxWidth="450px">
            <Dialog.Title>Edit Product</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              Make changes in Product.
            </Dialog.Description>

            <Flex direction="column" gap="3">
              <label>
                <Text size="2" mb="1" weight="bold">
                  Title
                </Text>
                <TextField.Root
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title}</p>
                )}
              </label>

              <label>
                <Text size="2" mb="1" weight="bold">
                  Description
                </Text>
                <TextField.Root
                  placeholder="description"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
                {errors.desc && (
                  <p className="text-red-500 text-sm">{errors.desc}</p>
                )}
              </label>

              <label>
                <Text size="2" mb="1" weight="bold">
                  Price
                </Text>
                <TextField.Root
                  placeholder="Enter price"
                  value={price}
                  type="number"
                  onChange={(e) => setPrice(e.target.value)}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price}</p>
                )}
              </label>

              <label>
                <Text size="2" mb="1" weight="bold">
                  Stock
                </Text>
                <TextField.Root
                  placeholder="stock"
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
                {errors.stock && (
                  <p className="text-red-500 text-sm">{errors.stock}</p>
                )}
              </label>

              <label>
                <Text size="2" mb="1" weight="bold">
                  Image
                </Text>
                <TextField.Root
                  placeholder="image"
                  value={image}
                  type="url"
                  onChange={(e) => setImage(e.target.value)}
                />
                {errors.image && (
                  <p className="text-red-500 text-sm">{errors.image}</p>
                )}
              </label>

              <Select.Root
                defaultValue={product.category}
                onValueChange={setCat}
              >
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
              {errors.cat && (
                <p className="text-red-500 text-sm">{errors.cat}</p>
              )}
            </Flex>

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button onClick={handleEditProd}>Save</Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </>
  );
}

export default EditProduct;
