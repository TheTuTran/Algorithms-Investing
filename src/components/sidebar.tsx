"use client";

import { FC } from "react";
import { ALGORITHMS, EXPLORE, OTHER_LINKS, WORK_IN_PROGRESS } from "@/lib/consts/navigation";
import { usePathname } from "next/navigation";

interface SidebarProps {}

const Sidebar: FC<SidebarProps> = ({}) => {
  const pathname = usePathname();
  return (
    <aside className="min-w-[200px] fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-[full] shrink-0 md:sticky md:block">
      <div className="relative overflow-hidden w-full h-full py-6 lg:py-8">
        <div data-radix-scroll-area-viewport="" className="h-full w-full rounded-[inherit] ">
          <div className="min-w-full table-auto">
            <div className="w-full">
              <div>
                {[
                  {
                    header: "Find Daily Trades",
                    items: EXPLORE,
                  },
                  {
                    header: "Apply Algorithms",
                    items: ALGORITHMS,
                  },
                  /*
                  {
                    header: "Work In Progress",
                    items: WORK_IN_PROGRESS,
                  },
                  */
                ].map((section) => (
                  <div className="pb-4" key={section.header}>
                    <h4 className="mb-1 rounded-md px-2 py-1 text-md font-black truncate">{section.header}</h4>
                    <div className="grid grid-flow-row auto-rows-max text-sm">
                      {section.items.map((item) => (
                        <a
                          key={item.href}
                          className={`${
                            pathname.split("/")[1] === item.href ? "font-black text-primary" : "text-muted-foreground hover:font-semibold"
                          } truncate group flex w-full items-center rounded-md border border-transparent px-2 py-1 `}
                          href={item.href}
                        >
                          {item.title}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
