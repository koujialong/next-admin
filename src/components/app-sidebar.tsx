import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { getBlogFiles } from "@/app/lib/utils";
import { ssgPaths } from "@/app/ssg/[...slug]/page";
import { isrPaths } from "@/app/isr/[...slug]/page";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Swr&Table",
    url: "/query",
    icon: Inbox,
  },
  {
    title: "SSG",
    url: "/ssg",
    icon: Calendar,
    child: getBlogFiles(ssgPaths).map((name) => ({
      title: name.split(".")[0],
      url: `/ssg/${name}`,
    })),
  },
  {
    title: "ISR",
    url: "/isr",
    icon: Search,
    child: getBlogFiles(isrPaths).map((name) => ({
      title: name.split(".")[0],
      url: `/isr/${name}`,
    })),
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>NEXT</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) =>
                item.child ? (
                  <Collapsible
                    defaultOpen
                    className="group/collapsible"
                    key={item.title}
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton asChild>
                          <a>
                            <item.icon />
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.child.map((menu) => (
                            <SidebarMenuSubItem key={menu.url}>
                              <SidebarMenuButton asChild>
                                <a href={menu.url}>
                                  <span>{menu.title}</span>
                                </a>
                              </SidebarMenuButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
