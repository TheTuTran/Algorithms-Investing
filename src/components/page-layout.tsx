"use client";
import { FC } from "react";
import Sidebar from "./sidebar";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="flex-1">
      <div className="border-b">
        <div className="md:grid-cols-[260px_minmax(0,1fr)] container min-w-[80vw] flex-1 items-start md:grid md:gap-6 lg:gap-10 min-h-[calc(100vh-154px)]">
          <Sidebar />
          <main className={`relative py-6 lg:gap-10 lg:py-8 h-full w-full`}>
            <div className="mx-auto w-full min-w-0 h-full min-h-0">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
