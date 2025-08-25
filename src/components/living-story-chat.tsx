
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Bot, Loader2, Sparkles, MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import { livingStoryAction } from "@/lib/actions";
import type { LivingStoryInput } from "@/ai/flows/living-story-flow";
import type { GeneratedStory } from "@/ai/flows/generate-story";

interface Message {
  id: string;
  text: string;
  role: "user" | "model";
}

interface LivingStoryChatProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  story: GeneratedStory | null;
}

export function LivingStoryChat({ isOpen, onOpenChange, story }: LivingStoryChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
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

  // Get initial greeting from AI when the dialog opens
  useEffect(() => {
    const getInitialGreeting = async () => {
      if (!isOpen || !story || initialGreetingSent) return;

      setIsLoading(true);
      setInitialGreetingSent(true);

      try {
        const aiInput: LivingStoryInput = {
          message: "Hello, please introduce yourself and start the conversation.",
          storyTitle: story.title,
          storyContent: story.story,
          learningLanguage: getLanguageLabel(learningLanguage),
          spokenLanguage: getLanguageLabel(spokenLanguage),
          history: [],
        };

        const response = await livingStoryAction(aiInput);

        const aiMessage: Message = { id: `ai-initial-${Date.now()}`, text: response, role: "model" };
        setMessages([aiMessage]);
      } catch (error) {
        toast({
          title: "Error Starting Chat",
          description: (error as Error).message || "Could not get a response from the AI character.",
          variant: "destructive",
        });
        const errorMessage: Message = {
          id: `ai-error-${Date.now()}`,
          text: "Sorry, I couldn't start the chat. Please try again.",
          role: "model",
        };
        setMessages([errorMessage]);
      } finally {
        setIsLoading(false);
        inputRef.current?.focus();
      }
    };

    getInitialGreeting();
  }, [isOpen, story, initialGreetingSent, learningLanguage, spokenLanguage, getLanguageLabel, toast]);

  // Reset state when the dialog is closed
  useEffect(() => {
    if (!isOpen) {
      setMessages([]);
      setInputValue("");
      setInitialGreetingSent(false);
      setIsLoading(true);
    }
  }, [isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !story) return;

    const userMessage: Message = { id: `user-${Date.now()}`, text: inputValue, role: "user" };
    const newMessages: Message[] = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const historyForApi = newMessages.map(m => ({ role: m.role, content: m.text }));

      const aiInput: LivingStoryInput = {
        message: userMessage.text,
        storyTitle: story.title,
        storyContent: story.story,
        learningLanguage: getLanguageLabel(learningLanguage),
        spokenLanguage: getLanguageLabel(spokenLanguage),
        history: historyForApi.slice(0, -1),
      };

      const response = await livingStoryAction(aiInput);
      const aiMessage: Message = { id: `ai-${Date.now()}`, text: response, role: "model" };
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
            <MessageSquare className="h-6 w-6 text-primary" />
            Talk About the Story
          </DialogTitle>
          <DialogDescription>
            Chat with a character from "{story?.title}" to practice your conversation skills.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="p-6 space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex items-start gap-4 ${message.role === "user" ? "justify-end" : ""}`}>
                  {message.role === "model" && (
                    <Avatar className="h-9 w-9 border-2 border-primary/50">
                      <AvatarFallback className="bg-primary/20 text-primary"><Bot size={20} /></AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-xl rounded-2xl px-4 py-3 shadow-md ${message.role === "user" ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted text-muted-foreground rounded-bl-none"}`}>
                    <p className="text-sm sm:text-base whitespace-pre-wrap">{message.text}</p>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-9 w-9 border-2 border-muted">
                      <AvatarFallback className="bg-muted"><User size={20} /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-4">
                  <Avatar className="h-9 w-9 border-2 border-primary/50">
                    <AvatarFallback className="bg-primary/20 text-primary"><Bot size={20} /></AvatarFallback>
                  </Avatar>
                  <div className="max-w-xl rounded-2xl px-4 py-3 shadow-md bg-muted text-muted-foreground rounded-bl-none">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="p-4 border-t bg-background/80 backdrop-blur-sm">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-3 w-full">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Ask a question or continue the conversation..."
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
