"use client";

import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { aiLanguagePartnerAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport="true"]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages]);
  
  useEffect(() => {
    // Add an initial greeting message from the AI
    setMessages([
      {
        id: "initial-greeting",
        text: "Bonjour! Comment puis-je vous aider aujourd'hui? N'hésitez pas à me poser des questions en français ou à me demander des traductions ou des astuces de grammaire.",
        sender: "ai",
        timestamp: new Date(),
      },
    ]);
    inputRef.current?.focus();
  }, []);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const aiResponse = await aiLanguagePartnerAction({ message: userMessage.text });
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.response,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Could not get response from AI.",
        variant: "destructive",
      });
       const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Désolé, je n'ai pas pu traiter votre demande. Veuillez réessayer.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <Card className="flex-1 flex flex-col shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="font-headline text-2xl text-primary">AI Language Partner</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-end space-x-3 ${
                    message.sender === "user" ? "justify-end" : ""
                  }`}
                >
                  {message.sender === "ai" && (
                    <Avatar className="h-8 w-8 self-start">
                      <AvatarFallback><Bot size={18}/></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-xs lg:max-w-md p-3 rounded-lg shadow ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sender === "user" ? "text-primary-foreground/70 text-right" : "text-muted-foreground/70"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {message.sender === "user" && (
                     <Avatar className="h-8 w-8 self-start">
                      <AvatarFallback><User size={18} /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-end space-x-3">
                  <Avatar className="h-8 w-8 self-start">
                     <AvatarFallback><Bot size={18}/></AvatarFallback>
                  </Avatar>
                  <div className="max-w-xs lg:max-w-md p-3 rounded-lg shadow bg-muted text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <div className="border-t p-4 bg-background">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Type your message in French or ask a question..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1"
              disabled={isLoading}
              aria-label="Chat input"
            />
            <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
