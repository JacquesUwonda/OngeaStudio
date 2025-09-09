import { getAdmin } from "@/lib/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { signOutAction } from "@/lib/actions";
import { LogOut, ShieldCheck } from "lucide-react";

export async function AdminNav() {
  const admin = await getAdmin();

  if (!admin) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/20 text-primary font-semibold">
              <ShieldCheck className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Administrator</p>
            <p className="text-xs leading-none text-muted-foreground">
              {admin.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <form action={signOutAction}>
            <input type="hidden" name="redirectTo" value="/admin/signin" />
            <button type="submit" className="w-full">
                <DropdownMenuItem className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
