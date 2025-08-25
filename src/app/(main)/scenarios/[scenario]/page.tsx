
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams, notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Bot, Loader2, Sparkles, ArrowLeft, Library } from "lucide-react";
import { rolePlayingScenarioAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import type { RolePlayingScenarioInput } from "@/ai/flows/role-playing-scenario";
import { scenarios as scenarioDetails } from '../page'; // Import scenario details to get the icon

interface Message {
  id: string;
  text: string;
  role: "user" | "model";
}

export default function ScenarioPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const { learningLanguage, spokenLanguage, getLanguageLabel } = useLanguage();

    const scenarioSlug = params.scenario as string;
    const scenarioInfo = scenarioDetails.find(s => s.href === `/scenarios/${scenarioSlug}`);
    const scenario = scenarioInfo?.name;
    const ScenarioIcon = scenarioInfo?.icon;
    
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(true); // Start with loading true for initial message
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [initialGreetingSent, setInitialGreetingSent] = useState(false);

    useEffect(() => {
        if (!scenario) {
            notFound();
        }
    }, [scenario]);

    // Auto-scroll to the bottom of the chat
    useEffect(() => {
        if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
        }
    }, [messages]);

    // Get initial greeting from AI
    useEffect(() => {
        const getInitialGreeting = async () => {
            if (!scenario || initialGreetingSent) return;

            setIsLoading(true);
            setInitialGreetingSent(true);

            try {
                const aiInput: RolePlayingScenarioInput = {
                    message: "Hello, please start the scene.", // Initial prompt to get AI to greet
                    scenario: scenario,
                    learningLanguage: getLanguageLabel(learningLanguage),
                    spokenLanguage: getLanguageLabel(spokenLanguage),
                    history: [],
                };

                const response = await rolePlayingScenarioAction(aiInput);

                const aiMessage: Message = {
                    id: `ai-initial-${Date.now()}`,
                    text: response,
                    role: "model",
                };
                setMessages([aiMessage]);
            } catch (error) {
                toast({
                    title: "Error Starting Scenario",
                    description: (error as Error).message || "Could not get a response from the AI character.",
                    variant: "destructive",
                });
                 const errorMessage: Message = {
                    id: `ai-error-${Date.now()}`,
                    text: "Sorry, I couldn't start the scenario. Please try going back and selecting it again.",
                    role: "model",
                };
                setMessages([errorMessage]);
            } finally {
                setIsLoading(false);
                inputRef.current?.focus();
            }
        };

        getInitialGreeting();
    }, [scenario, initialGreetingSent, learningLanguage, spokenLanguage, getLanguageLabel, toast]);
    
    if (!scenario || !ScenarioIcon) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p>Loading scenario...</p>
            </div>
        )
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            text: inputValue,
            role: "user",
        };
        
        const newMessages: Message[] = [...messages, userMessage];
        setMessages(newMessages);
        setInputValue("");
        setIsLoading(true);

        try {
            const historyForApi = newMessages.map(m => ({ role: m.role, content: m.text }));

            const aiInput: RolePlayingScenarioInput = {
                message: userMessage.text,
                scenario,
                learningLanguage: getLanguageLabel(learningLanguage),
                spokenLanguage: getLanguageLabel(spokenLanguage),
                history: historyForApi.slice(0, -1), // Send history BEFORE the user's latest message
            };

            const response = await rolePlayingScenarioAction(aiInput);

            const aiMessage: Message = {
                id: `ai-${Date.now()}`,
                text: response,
                role: "model",
            };
            setMessages((prev) => [...prev, aiMessage]);

        } catch (error) {
            toast({
                title: "Error",
                description: (error as Error).message || "Could not get response from AI.",
                variant: "destructive",
            });
            const aiMessage: Message = {
                id: `ai-error-${Date.now()}`,
                text: "Sorry, I couldn't process your request. Please try again.",
                role: "model",
            };
            setMessages((prev) => [...prev, aiMessage]);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    return (
        <div className="flex flex-col h-full">
            <header className="flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm">
                 <Button variant="ghost" size="icon" onClick={() => router.push('/scenarios')}>
                    <ArrowLeft className="h-5 w-5" />
                    <span className="sr-only">Back to Scenarios</span>
                </Button>
                <h1 className="text-xl font-bold font-headline text-primary flex items-center gap-2">
                    <ScenarioIcon className="h-6 w-6"/>
                    {scenario}
                </h1>
                {/* A placeholder for the right side to balance the back button */}
                <div className="w-10"></div> 
            </header>

            <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full" ref={scrollAreaRef}>
                <div className="p-4 sm:p-6 md:p-8 space-y-6">
                    {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex items-start gap-4 ${
                        message.role === "user" ? "justify-end" : ""
                        }`}
                    >
                        {message.role === "model" && (
                        <Avatar className="h-9 w-9 border-2 border-primary/50">
                            <AvatarFallback className="bg-primary/20 text-primary">
                                <Bot size={20} />
                            </AvatarFallback>
                        </Avatar>
                        )}

                        <div
                        className={`max-w-xl rounded-2xl px-4 py-3 shadow-md ${
                            message.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-none"
                            : "bg-muted text-muted-foreground rounded-bl-none"
                        }`}
                        >
                            <p className="text-sm sm:text-base whitespace-pre-wrap">{message.text}</p>
                        </div>

                        {message.role === "user" && (
                        <Avatar className="h-9 w-9 border-2 border-muted">
                            <AvatarFallback className="bg-muted">
                            <User size={20} />
                            </AvatarFallback>
                        </Avatar>
                        )}
                    </div>
                    ))}
                    {isLoading && (
                    <div className="flex items-start gap-4">
                        <Avatar className="h-9 w-9 border-2 border-primary/50">
                        <AvatarFallback className="bg-primary/20 text-primary">
                            <Bot size={20} />
                        </AvatarFallback>
                        </Avatar>
                        <div className="max-w-xl rounded-2xl px-4 py-3 shadow-md bg-muted text-muted-foreground rounded-bl-none">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        </div>
                    </div>
                    )}
                </div>
                </ScrollArea>
            </div>

            <div className="border-t bg-background/80 backdrop-blur-sm">
                <div className="p-4">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    <Input
                        ref={inputRef}
                        type="text"
                        placeholder={`Practice "${scenario}"...`}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="flex-1 h-12 text-base rounded-full focus-visible:ring-primary/50"
                        disabled={isLoading}
                        aria-label="Chat input"
                    />
                    <Button type="submit" size="icon" className="h-12 w-12 rounded-full" disabled={isLoading || !inputValue.trim()}>
                        {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
                        <span className="sr-only">Send message</span>
                    </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
