
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { BookHeart, Languages, MessageSquareText } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { availableLanguages } from "@/contexts/language-context";
import { useState } from "react";

export default function SignUpPage() {
  const [spokenLanguage, setSpokenLanguage] = useState("en");
  const [learningLanguage, setLearningLanguage] = useState("fr");

  return (
    <Card className="w-full max-w-sm shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center items-center mb-4">
          <BookHeart className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-3xl font-bold font-headline">Create an Account</CardTitle>
        <CardDescription>Enter your details to start your language journey</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullname">Full Name</Label>
          <Input id="fullname" type="text" placeholder="John Doe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="spoken-language" className="flex items-center text-sm">
                    <MessageSquareText className="mr-1.5 h-4 w-4"/>
                    Your Language
                </Label>
                <Select value={spokenLanguage} onValueChange={setSpokenLanguage}>
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
                <Select value={learningLanguage} onValueChange={setLearningLanguage}>
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
          <PasswordInput id="password" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full">Sign Up</Button>
        <p className="text-xs text-center text-muted-foreground">
          This is a placeholder sign-up page. Authentication is not fully implemented.
        </p>
        <Link href="/signin" className="text-sm text-primary hover:underline">
          Already have an account? Sign In
        </Link>
      </CardFooter>
    </Card>
  );
}
