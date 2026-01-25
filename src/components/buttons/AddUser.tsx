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
import { User } from "generated/prisma";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IoPersonAdd } from "react-icons/io5";

interface AddUserProps {
  userList: User[];
  setUserList: React.Dispatch<React.SetStateAction<User[]>>;
}

function AddUser({ userList, setUserList }: AddUserProps) {
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

    // Name: only alphabets + spaces
    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      newErrors.name = "Name must contain only alphabets";
    }

    // Username: must start with a letter, alphanumeric only, no emojis
    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (!/^[A-Za-z][A-Za-z0-9]*$/.test(username)) {
      newErrors.username =
        "Username must start with a letter and contain only alphanumeric characters (no emojis)";
    }

    // Email: must be Gmail only, end with .com, no emojis
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Za-z0-9._%+-]+@gmail\.com$/.test(email)) {
      newErrors.email =
        "Enter a valid Gmail address (must end with @gmail.com, no emojis)";
    }

    // Password: at least 6 characters, ASCII only (no emojis)
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/^[\x00-\x7F]*$/.test(password)) {
      newErrors.password =
        "Password cannot contain emojis or non-ASCII characters";
    }

    // Role: required
    if (!role.trim()) {
      newErrors.role = "Role is required";
    }

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
