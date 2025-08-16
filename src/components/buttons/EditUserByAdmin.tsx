"use client";
import { CREATE_USER, EDIT_USER_BY_ADMIN } from "@/lib/gql/mutation";
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
import { FaEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";

function EditUserByAdmin({ user }: { user: User }) {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [username, setUsername] = useState(user.username || "");
  const [password, setPassword] = useState(user.password || "");
  const [role, setRole] = useState<string>(user.role || "staff");
  const router = useRouter();

  const handleAddUser = async () => {
    try {
      const editUser: {
        updateUserByAdmin: User;
      } = await gqlClient.request(EDIT_USER_BY_ADMIN, {
        userId: user.id,
        name: name ? name : user.name,
        email,
        username,
        password,
        role,
      });
      console.log(editUser);
      if (editUser.updateUserByAdmin) {
        router.refresh();
        // alert("User Edited Successfully");
      } else {
        alert("Updation failed");
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
          <FaEdit size={19} />
        </Dialog.Trigger>

        <Dialog.Content maxWidth="450px">
          <Dialog.Title>Edit Member Details</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Edit the deatils of member
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
            <Dialog.Close>
              <Button onClick={handleAddUser}>Edit</Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}

export default EditUserByAdmin;
