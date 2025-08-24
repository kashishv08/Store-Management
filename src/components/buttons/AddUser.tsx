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

function AddUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("staff");
  const router = useRouter();

  const handleAddUser = async () => {
    try {
      const createdUser: {
        createUser: User;
      } = await gqlClient.request(CREATE_USER, {
        name,
        email,
        username,
        password,
        role,
      });
      console.log(createdUser);
      if (createdUser.createUser) {
        router.refresh();
        setName("");
        setUsername("");
        setEmail("");
        setPassword("");
        setRole("Staff");
      } else {
        alert("User creation failed");
      }
    } catch (e: any) {
      console.log(e);
      alert(e.message);
    }
  };

  return (
    <div>
      <Dialog.Root>
        <Dialog.Trigger>
          <Button variant="solid" color="indigo" style={{ cursor: "pointer" }}>
            <IoPersonAdd size={17} />
          </Button>
        </Dialog.Trigger>

        <Dialog.Content maxWidth="450px">
          <Dialog.Title>Add Member</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Add member
          </Dialog.Description>

          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Name
              </Text>
              <TextField.Root
                placeholder="Enter your full name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Username
              </Text>
              <TextField.Root
                placeholder="Enter your username"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Email
              </Text>
              <TextField.Root
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Password
              </Text>
              <TextField.Root
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </label>
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
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button onClick={handleAddUser}>Save</Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}

export default AddUser;
