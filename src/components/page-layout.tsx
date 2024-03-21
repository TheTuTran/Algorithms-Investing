"use client";
import { usePathname } from "next/navigation";
import { FC } from "react";
import Sidebar from "./sidebar";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: FC<PageLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  return (
    <div className="flex-1">
      <div className="border-b">
        <div className=" md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)] container flex-1 items-start md:grid  md:gap-6 lg:gap-10 min-h-[calc(100vh-154px)]">
          <Sidebar />
          <main
            className={` ${
              pathname.includes("/docs/") && "xl:grid xl:grid-cols-[1fr_300px]"
            } relative py-6 lg:gap-10 lg:py-8 h-full w-full`}
          >
            <div className="mx-auto w-full min-w-0 h-full min-h-0">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
