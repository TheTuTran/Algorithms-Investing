"use client";

import { FC } from "react";
import { ALGORITHMS, EXPLORE, OTHER_LINKS, WORK_IN_PROGRESS } from "@/lib/consts/navigation";
import { usePathname } from "next/navigation";

interface SidebarProps {}

const Sidebar: FC<SidebarProps> = ({}) => {
  const pathname = usePathname();
  return (
    <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
      <div className="relative overflow-hidden h-full py-6 pl-8 pr-6 lg:py-8">
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
                 
                  { header: "Others", items: OTHER_LINKS },
                 */
                ].map((section) => (
                  <div className="pb-4" key={section.header}>
                    <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold truncate">{section.header}</h4>
                    <div className="grid grid-flow-row auto-rows-max text-sm">
                      {section.items.map((item) => (
                        <a
                          key={item.href}
                          className={`${pathname.includes(item.href) ? "" : "text-muted-foreground"} group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline `}
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
