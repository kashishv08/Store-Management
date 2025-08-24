"use client";
import React, { Suspense, useState } from "react";
import { HiOutlineMenu } from "react-icons/hi";
import { MdArrowBackIosNew } from "react-icons/md";
import AllProducts from "./AllProducts";
import UserList from "./buttons/MembersList";

// const UserList = React.lazy(() => import("./buttons/MembersList"));
// const AllProducts = React.lazy(() => import("./AllProducts"));

function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex w-full h-screen relative overflow-hidden">
      {/* <Suspense
        fallback={
          <div className="flex w-full h-full items-center justify-center">
            <p className="text-lg font-medium text-white">
              Loading admin panel...
            </p>
          </div>
        }
      > */}
      <button
        className="md:hidden absolute top-27 right-0 z-50 text-white p-2 rounded-lg shadow-lg mr-[10px]"
        onClick={() => setSidebarOpen(true)}
      >
        <HiOutlineMenu
          size={24}
          className={`${sidebarOpen ? "hidden" : "block"}`}
        />
      </button>

      <div className="md:w-[70%] h-full min-h-0 overflow-y-auto scrollbar-hide">
        <AllProducts />
      </div>

      <div
        className={`
          fixed right-0 h-full bg-[#1F2937] p-4 shadow-inner
          w-64 md:relative md:w-[30%] transition-transform duration-300 mt-[10px]
          ${sidebarOpen ? "translate-x-0 top-15" : "translate-x-full top-20"}
          md:translate-x-0
          flex flex-col
        `}
      >
        <button
          className="md:hidden mb-4 text-white flex items-center gap-1"
          onClick={() => setSidebarOpen(false)}
        >
          <MdArrowBackIosNew /> Close
        </button>

        <UserList />
      </div>
      {/* </Suspense> */}
    </div>
  );
}

export default Admin;
