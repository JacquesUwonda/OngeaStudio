
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Bot, Loader2, Sparkles } from "lucide-react";
import { aiLanguagePartnerAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import type { AiLanguagePartnerInput } from "@/ai/flows/ai-language-partner";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { learningLanguage, spokenLanguage, getLanguageLabel } = useLanguage();
  const [initialGreetingSent, setInitialGreetingSent] = useState(false);

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  // Set initial greeting and focus input
  useEffect(() => {
    if (!initialGreetingSent && learningLanguage && spokenLanguage) {
      const learningLangLabel = getLanguageLabel(learningLanguage);
      const spokenLangLabel = getLanguageLabel(spokenLanguage);
      
      setMessages([
        {
          id: "initial-greeting",
          text: `Hello! I'm your AI partner to help you learn ${learningLangLabel}. We'll chat mostly in ${spokenLangLabel}. Feel free to ask me for translations, grammar tips, or try practicing ${learningLangLabel} with me!`,
          sender: "ai",
        },
      ]);
      setInitialGreetingSent(true);
    }
    inputRef.current?.focus();
  }, [initialGreetingSent, learningLanguage, spokenLanguage, getLanguageLabel]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Add a placeholder for the AI response
    const aiMessageId = `ai-${Date.now()}`;
    setMessages((prev) => [...prev, { id: aiMessageId, text: "", sender: "ai" }]);

    try {
      const aiInput: AiLanguagePartnerInput = {
        message: userMessage.text,
        learningLanguage: getLanguageLabel(learningLanguage),
        spokenLanguage: getLanguageLabel(spokenLanguage),
      };

      const stream = await aiLanguagePartnerAction(aiInput);

      for await (const chunk of stream) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId ? { ...msg, text: msg.text + chunk } : msg
          )
        );
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Could not get response from AI.",
        variant: "destructive",
      });
      // Update the placeholder with an error message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? { ...msg, text: "Sorry, I couldn't process your request. Please try again." }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-center p-4 border-b bg-background/80 backdrop-blur-sm">
        <h1 className="text-xl font-bold font-headline text-primary flex items-center gap-2">
            <Sparkles className="h-6 w-6"/>
            AI Language Partner ({getLanguageLabel(learningLanguage)})
        </h1>
      </header>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-4 sm:p-6 md:p-8 space-y-6">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex items-start gap-4 ${
                  message.sender === "user" ? "justify-end" : ""
                }`}
              >
                {message.sender === "ai" && (
                  <Avatar className="h-9 w-9 border-2 border-primary/50">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      <Bot size={20} />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-xl rounded-2xl px-4 py-3 shadow-md ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted text-muted-foreground rounded-bl-none"
                  }`}
                >
                  {message.text ? (
                     <p className="text-sm sm:text-base whitespace-pre-wrap">{message.text}</p>
                  ) : (
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  )}
                </div>

                {message.sender === "user" && (
                  <Avatar className="h-9 w-9 border-2 border-muted">
                    <AvatarFallback className="bg-muted">
                      <User size={20} />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="border-t bg-background/80 backdrop-blur-sm">
        <div className="p-4">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <Input
                ref={inputRef}
                type="text"
                placeholder="Ask a question or practice your skills..."
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
