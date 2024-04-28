import { PropsWithChildren } from "react";
import Navbar from "./navbar";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <main className="mt-14">{children}</main>
    </>
  );
}
