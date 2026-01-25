"use client";
import { ADD_PROD } from "@/lib/gql/mutation";
import { gqlClient } from "@/lib/service/gql";
import {
  Button,
  Dialog,
  Flex,
  Select,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiCartAdd } from "react-icons/bi";
import { Product } from "../../../generated/prisma";

function AddProduct({
  products,
  setProducts,
}: {
  products: Product[];
  setProducts: (x: Product[] | ((prev: Product[]) => Product[])) => void;
}) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [cat, setCat] = useState("others");
  const [price, setPrice] = useState("99.9");
  const [stock, setStock] = useState("1");
  const [image, setImage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    // Title
    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (!/^[A-Za-z\s]+$/.test(title.trim())) {
      newErrors.title = "Title must contain only alphabets";
    } else if (/^\d+$/.test(title.trim())) {
      newErrors.title = "Title cannot be only numbers";
    }

    // Description
    if (!desc.trim()) {
      newErrors.desc = "Description is required";
    } else if (desc.trim().length < 10) {
      newErrors.desc = "Description must be at least 10 characters";
    } else if (!/^[\x00-\x7F]*$/.test(desc.trim())) {
      newErrors.desc =
        "Description cannot contain emojis or non-ASCII characters";
    }

    // Price
    if (!price || isNaN(Number(price))) {
      newErrors.price = "Price must be a valid number";
    } else if (Number(price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    // Stock
    if (!stock || isNaN(Number(stock))) {
      newErrors.stock = "Stock must be a valid number";
    } else if (!Number.isInteger(Number(stock))) {
      newErrors.stock = "Stock must be an integer";
    } else if (Number(stock) <= 0) {
      newErrors.stock = "Stock must be greater than 0";
    }

    // Image
    if (!image.trim()) {
      newErrors.image = "Image URL is required";
    } else {
      try {
        new URL(image.trim());
      } catch {
        newErrors.image = "Enter a valid URL for the image";
      }
    }

    // Category
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

  const handleAddProd = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const prod: { addProduct: Product } = await gqlClient.request(ADD_PROD, {
      title,
      description: desc,
      category: cat,
      price: Number.parseFloat(price),
      stock: Number.parseInt(stock),
      imageUrl: image,
    });

    if (prod.addProduct) {
      setOpen(false);

      // Clear form state
      setTitle("");
      setDesc("");
      setCat("others");
      setPrice("99.9");
      setStock("1");
      setImage("");
      setErrors({});
      setProducts((prev: Product[]) => [...prev, prod.addProduct]);
      // router.refresh(); // optional
    } else {
      alert("Failed to add product.");
    }
  };

  return (
    <div>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger>
          <button className="px-3 inline-flex border p-1 border-white rounded-2xl bg-blue-900 gap-2 cursor-pointer">
            <BiCartAdd size={23} />
            <span className="hidden md:block">Product</span>
          </button>
        </Dialog.Trigger>

        <Dialog.Content maxWidth="450px">
          <Dialog.Title>Add Product</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Fill the form to add a new product.
          </Dialog.Description>

          <Flex direction="column" gap="3">
            {/* Title */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
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

            {/* Description */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Description
              </Text>
              <TextField.Root
                placeholder="Enter description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
              {errors.desc && (
                <p className="text-red-500 text-sm">{errors.desc}</p>
              )}
            </label>

            {/* Price */}
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
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price}</p>
              )}
            </label>

            {/* Stock */}
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
              {errors.stock && (
                <p className="text-red-500 text-sm">{errors.stock}</p>
              )}
            </label>

            {/* Image */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Image URL
              </Text>
              <TextField.Root
                placeholder="Enter image URL"
                value={image}
                type="url"
                onChange={(e) => setImage(e.target.value)}
              />
              {errors.image && (
                <p className="text-red-500 text-sm">{errors.image}</p>
              )}
            </label>

            {/* Category */}
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
            {errors.cat && <p className="text-red-500 text-sm">{errors.cat}</p>}
          </Flex>

          {/* Buttons */}
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Button onClick={handleAddProd}>Save</Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}

export default AddProduct;
