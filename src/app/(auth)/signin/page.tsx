import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { BookHeart } from "lucide-react";

export default function SignInPage() {
  return (
    <Card className="w-full max-w-sm shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center items-center mb-4">
          <BookHeart className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-3xl font-bold font-headline">Welcome to Ongea</CardTitle>
        <CardDescription>Enter your credentials to access your learning journey</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full">Sign In</Button>
        <p className="text-xs text-center text-muted-foreground">
          This is a placeholder sign-in page. Authentication is not fully implemented.
        </p>
        <Link href="/" className="text-sm text-primary hover:underline">
          Back to Dashboard
        </Link>
      </CardFooter>
    </Card>
  );
}
