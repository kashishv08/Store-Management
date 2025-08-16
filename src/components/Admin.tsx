"use client";
import React, { useState } from "react";
import UserList from "./buttons/MembersList";
import AllProducts from "./AllProducts";
import { HiOutlineMenu } from "react-icons/hi";
import { MdArrowBackIosNew } from "react-icons/md";

function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex w-full h-screen relative">
      <button
        className="md:hidden absolute top-4 right-0 z-50 text-white p-2 rounded-lg shadow-lg mr-[10px]"
        onClick={() => setSidebarOpen(true)}
      >
        <HiOutlineMenu
          size={24}
          className={`${sidebarOpen ? "hidden" : "block"}`}
        />
      </button>

      <div className="md:w-[70%]">
        <AllProducts />
      </div>

      <div
        className={`
          fixed top-0 right-0 h-full bg-[#1F2937] p-4 shadow-inner
          w-64 md:relative md:w-[30%] transition-transform duration-300 mt-[10px]
          ${sidebarOpen ? "translate-x-0 " : "translate-x-full"}
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
    </div>
  );
}

export default Admin;
