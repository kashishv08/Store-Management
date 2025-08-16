"use client";
import Header from "@/components/Header";
import { LOG_IN } from "@/lib/gql/queries";
import { gqlClient } from "@/lib/service/gql";
import { Button, Card, Text, TextField } from "@radix-ui/themes";
import Image from "next/image";
import { useState } from "react";
import { User } from "../../../generated/prisma";

function page() {
  const [password, setPassword] = useState("");
  const [userCred, setuserCred] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{
    message?: string;
  }>({});

  const handleLogin = async () => {
    setError({});
    setLoading(true);
    try {
      const loginuser: {
        loginUser: User;
      } = await gqlClient.request(LOG_IN, {
        userCred,
        password,
      });
      console.log(loginuser);
      if (loginuser.loginUser) {
        window.location.href = "/";
      } else {
        setError({
          message: "Invalid Credentials",
        });
      }
    } catch (error: any) {
      setError({
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-full bg-black">
      <Card
        className="p-6 rounded-2xl shadow-lg gap-4 border border-gray-200"
        style={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="relative h-[100px] w-[100px] rounded-full overflow-hidden shadow-md border border-gray-200">
          <Image
            fill
            src="https://tse2.mm.bing.net/th/id/OIP.FvEyj8zuNQbeGaGJhdhl8wAAAA?pid=Api&P=0&h=220"
            alt="logo"
          />
        </div>

        <div className="flex flex-col gap-3 w-[300px] mt-4">
          <TextField.Root
            className="border border-gray-200 p-2 rounded-2xl"
            placeholder="Enter username or email"
            value={userCred}
            onChange={(e) => setuserCred(e.target.value)}
          />
          <TextField.Root
            className="border border-gray-200 p-2 rounded-2xl"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mt-2 flex items-end">
          <Button
            onClick={handleLogin}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 transition-colors duration-200"
          >
            <Text className="text-white">
              {loading ? "Logging in..." : "Login"}
            </Text>
          </Button>
        </div>

        {error && error.message && (
          <p className="text-red-500 text-sm mt-2">{error.message}</p>
        )}
      </Card>
    </div>
  );
}

export default page;
