
"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { signUpAction } from '@/lib/actions';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { BookHeart, Languages, MessageSquareText, Loader2 } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { availableLanguages } from "@/contexts/language-context";
import { useEffect, useState } from "react";
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : "Sign Up"}
    </Button>
  );
}

export default function SignUpPage() {
  const [spokenLanguage, setSpokenLanguage] = useState("en");
  const [learningLanguage, setLearningLanguage] = useState("fr");
  const { toast } = useToast();

  const [state, formAction] = useFormState(signUpAction, {
    message: "",
    errors: undefined
  });

  useEffect(() => {
    if(state?.message) {
      toast({
        title: "Sign-up Failed",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast]);

  return (
    <Card className="w-full max-w-sm shadow-xl">
      <form action={formAction}>
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center items-center mb-4">
            <BookHeart className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Create an Account</CardTitle>
          <CardDescription>Enter your details to start your language journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" name="fullName" type="text" placeholder="John Doe" required />
            {state?.errors?.fullName && <p className="text-xs text-destructive mt-1">{state.errors.fullName[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            {state?.errors?.email && <p className="text-xs text-destructive mt-1">{state.errors.email[0]}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                  <Label htmlFor="spoken-language" className="flex items-center text-sm">
                      <MessageSquareText className="mr-1.5 h-4 w-4"/>
                      Your Language
                  </Label>
                  <Select name="spokenLanguage" value={spokenLanguage} onValueChange={setSpokenLanguage}>
                      <SelectTrigger id="spoken-language">
                          <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                          {availableLanguages.map(lang => (
                              <SelectItem key={`spoken-${lang.value}`} value={lang.value}>{lang.label}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="learning-language" className="flex items-center text-sm">
                      <Languages className="mr-1.5 h-4 w-4" />
                      To Learn
                  </Label>
                  <Select name="learningLanguage" value={learningLanguage} onValueChange={setLearningLanguage}>
                      <SelectTrigger id="learning-language">
                          <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                          {availableLanguages.map(lang => (
                              <SelectItem key={`learning-${lang.value}`} value={lang.value}>{lang.label}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
              </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput id="password" name="password" required />
            {state?.errors?.password && <p className="text-xs text-destructive mt-1">{state.errors.password[0]}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <SubmitButton />
          <Link href="/signin" className="text-sm text-primary hover:underline">
            Already have an account? Sign In
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
