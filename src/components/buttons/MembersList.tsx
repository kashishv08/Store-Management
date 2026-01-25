"use client";
import { REMOVE_MEMBER } from "@/lib/gql/mutation";
import { ALL_USER, FILTER_USER } from "@/lib/gql/queries";
import { gqlClient } from "@/lib/service/gql";
import {
  Avatar,
  Box,
  Card,
  Flex,
  Select,
  Spinner,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { UserContext } from "../context/user-context";
import AddUser from "./AddUser";
import ConfirmDelete from "./DeleteUser";
import EditUserByAdmin from "./EditUserByAdmin";
import { User } from "generated/prisma";

function UserList() {
  const { user } = useContext(UserContext);
  const router = useRouter();

  const [inp, setInp] = useState("");
  const [role, setRole] = useState("");
  const [userList, setUserList] = useState<User[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilter = async () => {
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
      setLoading(false);
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
    console.log(delMember.RemoveMember);
    if (delMember.RemoveMember) {
      const newList = userList.filter((val, indx) => val.id != id);
      setUserList(newList);
    } else {
      alert(":/");
    }
  };

  return (
    <>
      {loading ? (
        <div className="text-white min-h-screen w-full justify-center items-center ml-[50%] mt-[65%]">
          <Spinner size="3" />
        </div>
      ) : (
        <div className="w-full flex flex-col gap-3 h-full">
          <div className="sticky top-10 md:top-0 z-10 bg-gray-800">
            <div className="flex justify-between items-center">
              <Text size="3" weight="bold" className="text-white">
                Team Members{" "}
                <span className="font-normal">({userList.length})</span>
              </Text>
              {user?.role === "admin" && (
                <AddUser userList={userList} setUserList={setUserList} />
              )}
            </div>
            <hr className="my-2" />

            <div className="flex justify-between w-full gap-2">
              <div className="w-[80%]">
                <TextField.Root
                  className="flex max-w-sm"
                  placeholder="Search user..."
                  value={inp}
                  onChange={(e) => setInp(e.target.value)}
                >
                  <TextField.Slot>
                    <IoMdSearch height="16" width="16" />
                  </TextField.Slot>
                </TextField.Root>
              </div>
              <div>
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
            </div>
          </div>

          <div className="md:overflow-y-auto scrollbar-custom pb-20">
            {userList.length === 0 ? (
              <p className="text-gray-400 text-center mt-10">No users found</p>
            ) : (
              userList.map((val, index) => (
                <Card
                  key={val.id || index}
                  className="bg-gray-800 p-3 rounded-xl transition-all cursor-pointer my-2"
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
                        <EditUserByAdmin user={val} setUserList={setUserList} />
                        <ConfirmDelete
                          onConfirm={() => handleRemoveMember(val.id)}
                        />
                      </div>
                    )}
                  </Flex>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default UserList;
