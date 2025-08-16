"use client";
import { Theme } from "@radix-ui/themes";
import React, { createContext, ReactNode, useState } from "react";
import { roleType, User } from "../../../generated/prisma";

export type userNoPass = {
  id: string;
  email: string;
  name: string;
  username: string;
  role: roleType;
  avatar: string | null;
};

export const UserContext = createContext<{
  user?: userNoPass;
}>({});

function UserContextProvider({
  children,
  user,
}: {
  children: ReactNode;
  user?: userNoPass;
}) {
  return (
    <div>
      <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
    </div>
  );
}

export default UserContextProvider;
