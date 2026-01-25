"use client";
import { EDIT_USER_BY_ADMIN } from "@/lib/gql/mutation";
import { gqlClient } from "@/lib/service/gql";
import {
  Button,
  Dialog,
  Flex,
  Select,
  Text,
  TextField,
} from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { ALL_USER } from "@/lib/gql/queries";
import { User } from "generated/prisma";

function EditUserByAdmin({
  user,
  setUserList,
}: {
  user: User;
  setUserList?: any;
}) {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [username, setUsername] = useState(user.username || "");
  const [password, setPassword] = useState(user.password || "");
  const [role, setRole] = useState<string>(user.role || "staff");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    // Name: only alphabets + spaces, min 3 chars, no emojis
    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      newErrors.name =
        "Name must contain only alphabets (no numbers or emojis)";
    }

    // Username: must start with letter, alphanumeric only, min 3 chars, no emojis
    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[A-Za-z][A-Za-z0-9]*$/.test(username)) {
      newErrors.username =
        "Username must start with a letter and contain only alphanumeric characters (no emojis)";
    }

    // Email: must be Gmail only, end with .com, no emojis
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Za-z0-9._%+-]+@gmail\.com$/.test(email)) {
      newErrors.email =
        "Enter a valid Gmail address (must end with @gmail.com)";
    }

    // Password: at least 6 chars, ASCII only (no emojis)
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.trim().length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/^[\x00-\x7F]*$/.test(password)) {
      newErrors.password =
        "Password cannot contain emojis or non-ASCII characters";
    }

    return newErrors;
  };

  const handleEditUser = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const editUser: { updateUserByAdmin: User } = await gqlClient.request(
        EDIT_USER_BY_ADMIN,
        {
          userId: user.id,
          name: name,
          email: email,
          username: username,
          password: password,
          role,
        }
      );

      console.log("Mutation Response:", editUser);
      if (editUser.updateUserByAdmin) {
        setOpen(false);
        if (setUserList) {
          setUserList((prev: User[]) => {
            const updatedList = prev.map((u) =>
              u.id === user.id
                ? { ...u, name, username, email, password, role }
                : u
            );
            console.log("Updated List:", updatedList);
            return updatedList;
          });
        }
      } else {
        alert("Updation failed ");
      }
    } catch (e: any) {
      console.log(e);
      alert(e.message);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <FaEdit size={18} className="cursor-pointer" />
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Edit Member Details</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Edit the details of member
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Name
            </Text>
            <TextField.Root
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </label>

          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Username
            </Text>
            <TextField.Root
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </label>

          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Email
            </Text>
            <TextField.Root
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </label>

          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Password
            </Text>
            <TextField.Root
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </label>

          <Select.Root value={role} onValueChange={setRole}>
            <Select.Trigger />
            <Select.Content>
              <Select.Group>
                <Select.Label>Role</Select.Label>
                <Select.Item value="manager">Manager</Select.Item>
                <Select.Item value="staff">Staff</Select.Item>
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
          <Button onClick={handleEditUser}>Save</Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default EditUserByAdmin;
