import { Toaster } from "sonner";

import { SidebarInset } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster position="top-center"/>
      <SidebarProvider>
        <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 p-4 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
