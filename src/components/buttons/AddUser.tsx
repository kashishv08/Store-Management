"use client";
import { CREATE_USER } from "@/lib/gql/mutation";
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
import { User } from "../../../generated/prisma";
import { useRouter } from "next/navigation";
import { IoPersonAdd } from "react-icons/io5";

function AddUser({ userList, setUserList }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("staff");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!username.trim()) newErrors.username = "Username is required";

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!role.trim()) newErrors.role = "Role is required";

    return newErrors;
  };

  const handleAddUser = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const createdUser: { createUser: User } = await gqlClient.request(
        CREATE_USER,
        { name, email, username, password, role }
      );

      if (createdUser.createUser) {
        setUserList((prev) => {
          return [...prev, createdUser.createUser];
        });
        setOpen(false);
        router.refresh();

        setName("");
        setUsername("");
        setEmail("");
        setPassword("");
        setRole("staff");
        setErrors({});
      } else {
        alert("User creation failed");
      }
    } catch (e: any) {
      console.error(e);
      alert(e.message);
    }
  };

  return (
    <div>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger>
          <Button variant="solid" color="indigo" style={{ cursor: "pointer" }}>
            <IoPersonAdd size={17} />
          </Button>
        </Dialog.Trigger>

        <Dialog.Content maxWidth="450px">
          <Dialog.Title>Add Member</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Fill all details to create a new user.
          </Dialog.Description>

          <Flex direction="column" gap="3">
            {/* Name */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Name
              </Text>
              <TextField.Root
                placeholder="Enter full name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </label>

            {/* Username */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Username
              </Text>
              <TextField.Root
                placeholder="Enter username"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username}</p>
              )}
            </label>

            {/* Email */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Email
              </Text>
              <TextField.Root
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </label>

            {/* Password */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Password
              </Text>
              <TextField.Root
                placeholder="Enter password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </label>

            {/* Role */}
            <Select.Root value={role} onValueChange={(value) => setRole(value)}>
              <Select.Trigger />
              <Select.Content>
                <Select.Group>
                  <Select.Label>Role</Select.Label>
                  <Select.Item value="manager">Manager</Select.Item>
                  <Select.Item value="staff">Staff</Select.Item>
                </Select.Group>
              </Select.Content>
            </Select.Root>
            {errors.role && (
              <p className="text-red-500 text-sm">{errors.role}</p>
            )}
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Button onClick={handleAddUser}>Save</Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}

export default AddUser;
