"use client";

import { Clapperboard, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    name: "Home",
    icon: <Home size="24px" />,
    link: "/",
  },
  {
    name: "Movie",
    icon: <Clapperboard size="24px" />,
    link: "/guess",
  },
];

export default function LayoutSidebar() {
  const pathname = usePathname();

  const defaultClass = "text-muted-foreground";
  const activeClass = "bg-accent text-accent-foreground";

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 py-4">
        {routes.map((route, index) => (
          <Link
            key={index}
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${pathname === route.link ? activeClass : defaultClass} transition-colors hover:text-foreground md:h-8 md:w-8`}
            href={route.link}
          >
            {route.icon}
            <span className="sr-only">{route.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
