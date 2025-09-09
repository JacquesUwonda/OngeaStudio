
"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { adminSignInAction } from '@/lib/actions';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookHeart, Loader2 } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : "Sign In"}
    </Button>
  );
}

export function AdminSignInForm() {
  const { toast } = useToast();

  const [state, formAction] = useFormState(adminSignInAction, {
    message: "",
    errors: undefined
  });

  useEffect(() => {
    if (state?.message) {
      toast({
        title: "Sign-in Failed",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm shadow-xl">
        <form action={formAction}>
            <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center items-center mb-4">
                <BookHeart className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold font-headline">Admin Sign In</CardTitle>
            <CardDescription>Enter your admin credentials to access the dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="admin@ongea.com" required />
                {state?.errors?.email && <p className="text-xs text-destructive mt-1">{state.errors.email[0]}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput id="password" name="password" required />
                {state?.errors?.password && <p className="text-xs text-destructive mt-1">{state.errors.password[0]}</p>}
            </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <SubmitButton />
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}
