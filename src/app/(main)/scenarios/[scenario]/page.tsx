
"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { ArrowLeft } from "lucide-react";

export default function ScenarioPage() {
    const params = useParams();
    const scenario = (params.scenario as string).replace(/-/g, ' ');

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4 sm:p-6 space-y-8">
            <Card className="w-full max-w-2xl p-8 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-3xl font-headline text-primary capitalize">
                        {scenario} Scenario
                    </CardTitle>
                    <CardDescription className="text-lg pt-2">
                        This is where the interactive role-playing chat will go.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        The AI will act as a character in this scenario (e.g., a waiter, a hotel clerk) and you will have a conversation to achieve a goal.
                    </p>
                    <p className="font-semibold text-accent mt-4">
                        This feature is currently under construction.
                    </p>
                </CardContent>
                 <div className="mt-8 text-center">
                    <Button variant="outline" asChild>
                    <Link href="/scenarios">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Scenarios
                    </Link>
                    </Button>
                </div>
            </Card>
        </div>
    );
}
