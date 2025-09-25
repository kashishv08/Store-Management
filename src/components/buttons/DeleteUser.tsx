"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { MdDelete, MdDeleteOutline } from "react-icons/md";
import { useState } from "react";

export default function ConfirmDelete({
  onConfirm,
}: {
  onConfirm: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {/* Trigger (button) */}
      <Dialog.Trigger asChild>
        <button className="flex justify-center items-center rounded transition cursor-pointer group">
          <MdDeleteOutline size={20} className="block group-hover:hidden" />
          <MdDelete size={20} className="hidden group-hover:block" />
        </button>
      </Dialog.Trigger>

      {/* Overlay */}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

        {/* Popup Content */}
        <Dialog.Content
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          bg-gray-800 text-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md"
        >
          <Dialog.Title className="text-lg font-bold mb-2">
            Confirm Delete
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-300 mb-4">
            Are you sure you want to delete this user? This action cannot be
            undone.
          </Dialog.Description>

          <div className="flex justify-end gap-3">
            <Dialog.Close asChild>
              <button className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition">
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={() => {
                onConfirm();
                setOpen(false);
              }}
              className="px-4 py-2 rounded-lg bg-red-400 transition text-white"
            >
              Delete
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
