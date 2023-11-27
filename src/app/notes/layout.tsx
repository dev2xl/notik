import NavBar from "@/app/notes/NavBar";
import { ReactNode } from "react";

const NotesLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <NavBar />
      <main className="m-auto h-screen max-w-7xl p-4">{children}</main>
    </>
  );
};

export default NotesLayout;
