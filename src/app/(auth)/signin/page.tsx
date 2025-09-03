
"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { signInAction } from '@/lib/actions';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { BookHeart, Loader2, LogOut, CheckCircle } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : "Sign In"}
    </Button>
  );
}

function LogoutAlert() {
  const searchParams = useSearchParams();
  const loggedOut = searchParams.get('logged_out');

  if (loggedOut) {
    return (
      <Alert variant="default" className="mb-6 bg-secondary border-primary/20">
        <CheckCircle className="h-4 w-4 text-primary" />
        <AlertTitle className="font-semibold text-primary">Logged Out</AlertTitle>
        <AlertDescription>
          You have been successfully signed out.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}

export default function SignInPage() {
  const { toast } = useToast();
  const [state, formAction] = useFormState(signInAction, {
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
    <Card className="w-full max-w-sm shadow-xl">
      <LogoutAlert />
      <form action={formAction}>
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center items-center mb-4">
            <BookHeart className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your learning journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
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
          <div className="text-sm">
            <Link href="/signup" className="text-primary hover:underline">
              Don't have an account? Sign Up
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
