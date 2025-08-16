"use client";
import React, { useContext, useState } from "react";
import { Avatar, Box, Card, DropdownMenu, Flex, Text } from "@radix-ui/themes";
import { UserContext, userNoPass } from "./context/user-context";
import EditOwnProfile from "./buttons/EditOwnProfile";
import { gqlClient } from "@/lib/service/gql";
import { LOG_OUT } from "@/lib/gql/mutation";
import { redirect } from "next/navigation";
import Link from "next/link";

function Header() {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    if (!user) {
      alert("No user logged in");
      return;
    }
    const logoutUser: {
      logout: userNoPass;
    } = await gqlClient.request(LOG_OUT, {
      id: user.id as string,
    });
    console.log(logoutUser);
    if (logoutUser.logout) {
      redirect("/login");
    } else {
      alert(":/");
    }
  };

  return (
    <div>
      <nav className="bg-gray-800 text-white px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap justify-between items-center gap-4">
        <Link href="/">
          <div className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <img
              src="https://tse4.mm.bing.net/th/id/OIP.FkpuTBvwTyfLTiJ81OXKzgHaHa?pid=Api&P=0&h=220"
              alt="logo"
              className="rounded-full h-10 w-10 sm:h-[50px] sm:w-[50px]"
            />
            <span className="">Store Management</span>
          </div>
        </Link>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <div className="inline-flex items-center gap-3 cursor-pointer">
              <Avatar
                size="3"
                radius="full"
                fallback={user?.name.charAt(0) || "U"}
                src={
                  user?.avatar ||
                  "https://tse1.mm.bing.net/th/id/OIP.thDjj-NA5m996XG5HFhq0wHaHa?pid=Api&P=0&h=220"
                }
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-sm font-semibold">{user?.name}</span>
                <span className="text-xs text-gray-300">{user?.role}</span>
              </div>
            </div>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item onSelect={() => setOpen(true)}>
              Edit Profile
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <button onClick={handleLogout}>Logout</button>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </nav>

      <EditOwnProfile open={open} setOpen={setOpen} user={user} />
    </div>
  );
}

export default Header;
