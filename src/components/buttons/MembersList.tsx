"use client";
import {
  Avatar,
  Box,
  Card,
  Flex,
  ScrollArea,
  Select,
  Text,
  TextField,
} from "@radix-ui/themes";
import { User } from "../../../generated/prisma";
import React, { useContext, useEffect, useState } from "react";
import EditUserByAdmin from "./EditUserByAdmin";
import { MdDeleteOutline } from "react-icons/md";
import { gqlClient } from "@/lib/service/gql";
import { REMOVE_MEMBER } from "@/lib/gql/mutation";
import { useRouter } from "next/navigation";
import { UserContext } from "../context/user-context";
import AddUser from "./AddUser";
import { ALL_USER, FILTER_USER } from "@/lib/gql/queries";

function UserList() {
  const { user } = useContext(UserContext);
  const router = useRouter();

  const [inp, setInp] = useState("");
  const [role, setRole] = useState("");
  const [userList, setUserList] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFilter = async () => {
      // setLoading(true);
      if (inp || role !== "all") {
        const filteredUser: { filterUser: User[] } = await gqlClient.request(
          FILTER_USER,
          {
            input: inp,
            role: role == "all" ? "" : role,
          }
        );
        setUserList(filteredUser.filterUser);
      } else {
        const data: { getAllUser: User[] } = await gqlClient.request(ALL_USER);
        setUserList(data.getAllUser);
      }
      // setLoading(false);
    };
    fetchFilter();
  }, [inp, role]);

  const handleRemoveMember = async (id: string) => {
    const delMember: {
      RemoveMember: {
        id: string;
      };
    } = await gqlClient.request(REMOVE_MEMBER, {
      userId: id,
    });
    if (delMember.RemoveMember) {
      window.location.reload();
    } else {
      alert(":/");
    }
  };

  return (
    <>
      {loading ? (
        <p>loading...</p>
      ) : (
        <div className="overflow-y-auto scrollbar-hide h-[500px] w-[100%] pb-[20px]">
          <div className="w-full flex flex-col gap-3 pb-4">
            {/* Header */}
            <div className="flex justify-between items-center">
              <Text size="3" weight="bold" className="text-white">
                Team Members{" "}
                <span className="font-normal">({userList.length})</span>
              </Text>
              {user?.role === "admin" && <AddUser />}
            </div>
            <hr />

            {/* Search & Filter */}
            <div className="flex justify-between">
              <TextField.Root
                className="flex max-w-sm"
                placeholder="Search user..."
                value={inp}
                onChange={(e) => setInp(e.target.value)}
              />
              <Select.Root defaultValue="all" onValueChange={setRole}>
                <Select.Trigger className="mt-1" />
                <Select.Content>
                  <Select.Group>
                    <Select.Item value="staff">Staff</Select.Item>
                    <Select.Item value="manager">Manager</Select.Item>
                    <Select.Item value="all">All</Select.Item>
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </div>

            {/* User Cards */}
            {userList.map((val) => (
              <Card
                key={val.id}
                className="bg-gray-800 p-3 rounded-xl transition-all cursor-pointer"
              >
                <Flex
                  gap="3"
                  align="center"
                  direction="row"
                  justify="between"
                  wrap="wrap"
                >
                  <div className="flex gap-3 items-center min-w-0">
                    <div className="hidden lg:block">
                      <Avatar
                        size="3"
                        radius="full"
                        fallback={val?.name?.charAt(0).toUpperCase() || "U"}
                        color="indigo"
                      />
                    </div>
                    <Box className="truncate">
                      <Text
                        as="div"
                        size="3"
                        weight="bold"
                        className="text-white truncate"
                      >
                        {val.name}
                      </Text>
                      <Text
                        as="div"
                        size="2"
                        className="text-gray-300 truncate"
                      >
                        {val.role}
                      </Text>
                    </Box>
                  </div>

                  {user?.role === "admin" && (
                    <div className="flex gap-2 flex-col sm:flex-row sm:items-center mt-2 sm:mt-0">
                      <EditUserByAdmin user={val} />
                      <button
                        className="flex justify-center items-center p-1 rounded hover:bg-red-600 transition"
                        onClick={() => handleRemoveMember(val.id)}
                      >
                        <MdDeleteOutline size={20} />
                      </button>
                    </div>
                  )}
                </Flex>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default UserList;
