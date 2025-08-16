import UserContextProvider, {
  userNoPass,
} from "@/components/context/user-context";
import Header from "@/components/Header";
import { getUserFromCookie } from "@/lib/helper";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import { User } from "../../../generated/prisma";

async function layout({ children }: { children: ReactNode }) {
  const user = await getUserFromCookie();
  if (!user) redirect("/login");
  //   console.log(user);

  return (
    <div>
      <UserContextProvider user={user}>
        <Header />
        {children}
      </UserContextProvider>
    </div>
  );
}

export default layout;
