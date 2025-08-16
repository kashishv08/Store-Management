"use client";
import { EDIT_PROFILE } from "@/lib/gql/mutation";
import { gqlClient } from "@/lib/service/gql";
import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { userNoPass } from "../context/user-context";

interface EditOwnProfileProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  user?: userNoPass;
}

function EditOwnProfile({ open, setOpen, user }: EditOwnProfileProps) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email);
  const [username, setUsername] = useState(user?.username);
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const router = useRouter();

  const handleEditProfile = async () => {
    try {
      const editUser: { updateProfile: userNoPass } = await gqlClient.request(
        EDIT_PROFILE,
        {
          userId: user?.id,
          name,
          email,
          username,
          avatar,
        }
      );
      console.log(editUser);
      if (editUser.updateProfile) {
        router.refresh();
        setOpen(!open);
      } else {
        alert("Edit failed");
      }
    } catch (e: any) {
      console.log(e);
      alert(e.message);
    }
  };

  return (
    <Dialog.Root open={open}>
      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Edit Profile</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Edit your profile details
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
              Avatar
            </Text>
            <TextField.Root
              type="url"
              placeholder="Enter avatar"
              onChange={(e) => setAvatar(e.target.value)}
              value={avatar}
            />
          </label>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray" onClick={() => setOpen(!open)}>
              Cancel
            </Button>
          </Dialog.Close>
          <Button onClick={handleEditProfile}>Save</Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default EditOwnProfile;
