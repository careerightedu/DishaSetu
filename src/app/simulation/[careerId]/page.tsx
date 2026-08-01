"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, Bot, Loader2, ArrowLeft, Award } from "lucide-react";
import Navbar from "@/features/auth/components/Navbar";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function SimulationPage({ params }: { params: { careerId: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const careerTitle = searchParams.get("title") || params.careerId;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulationComplete, setIsSimulationComplete] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    // Start the simulation immediately by requesting the first scenario
    if (messages.length === 0) {
      handleSend(true);
    }
  }, [user, router]);

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    // Check if the simulation is complete based on a keyword from the API
    if (messages.length > 0 && messages[messages.length - 1].role === "assistant" && messages[messages.length - 1].content.includes("[SIMULATION COMPLETE]")) {
      setIsSimulationComplete(true);
    }
  }, [messages]);

  const handleSend = async (isInitialCall = false) => {
    if (!isInitialCall && !input.trim()) return;

    const newMessages = isInitialCall ? [] : [...messages, { role: "user" as const, content: input }];
    if (!isInitialCall) {
      setMessages(newMessages);
      setInput("");
    }
    
    setIsLoading(true);

    try {
      const response = await fetch("/api/simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          careerId: params.careerId,
          careerTitle,
          messages: newMessages
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch simulation response");
      }

      const data = await response.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: "assistant", content: "Simulation error: System offline. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const cleanMessage = (content: string) => {
    return content.replace("[SIMULATION COMPLETE]", "").trim();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-primary/30">
      <Navbar />

      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 mt-16">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/results" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider mb-3 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Results
            </Link>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase flex items-center gap-3">
              <Bot className="h-8 w-8 text-primary" /> Career Simulation
            </h1>
            <p className="text-muted-foreground mt-2 font-medium">
              You are simulating a scenario for: <strong className="text-primary">{careerTitle}</strong>
            </p>
          </div>
        </div>

        {/* Chat UI */}
        <Card className="flex-1 flex flex-col border-border/40 bg-card/60 backdrop-blur-md shadow-2xl overflow-hidden min-h-[500px] max-h-[70vh]">
          <CardContent className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6" ref={scrollRef}>
            {messages.length === 0 && isLoading && (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm font-bold uppercase tracking-widest">Generating Real-World Scenario...</p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} className={`flex items-start gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                {/* Avatar */}
                <div className={`shrink-0 flex items-center justify-center h-10 w-10 rounded-full border-2 ${msg.role === "user" ? "bg-slate-800 border-slate-700" : "bg-primary/20 border-primary/50 text-primary"}`}>
                  {msg.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                </div>

                {/* Message Bubble */}
                <div className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} max-w-[80%]`}>
                  <div className={`text-[10px] font-black uppercase tracking-widest mb-1.5 ${msg.role === "user" ? "text-slate-400" : "text-primary"}`}>
                    {msg.role === "user" ? "You" : "Scenario Master"}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${msg.role === "user" ? "bg-slate-800 text-slate-200 border border-slate-700 rounded-tr-none" : "bg-background/80 text-foreground border border-border/50 rounded-tl-none"}`}>
                    {cleanMessage(msg.content)}
                  </div>
                </div>
              </div>
            ))}

            {messages.length > 0 && isLoading && (
              <div className="flex items-start gap-4">
                <div className="shrink-0 flex items-center justify-center h-10 w-10 rounded-full border-2 bg-primary/20 border-primary/50 text-primary">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
                <div className="bg-background/80 border border-border/50 p-4 rounded-2xl rounded-tl-none flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce delay-75" />
                  <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce delay-150" />
                </div>
              </div>
            )}

            {isSimulationComplete && (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="h-16 w-16 bg-amber-500/10 border-2 border-amber-500 rounded-full flex items-center justify-center animate-pulse">
                  <Award className="h-8 w-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-white">Simulation Completed</h3>
                <Link href="/results">
                  <Button className="font-bold uppercase tracking-widest">Return to Dashboard</Button>
                </Link>
              </div>
            )}
          </CardContent>

          {/* Input Area */}
          <CardFooter className="p-4 border-t border-border/40 bg-background/50">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex w-full gap-3"
            >
              <Input 
                disabled={isLoading || isSimulationComplete}
                placeholder={isSimulationComplete ? "Simulation finished." : "What do you do next?"} 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-background/50 border-border/60 focus-visible:ring-primary h-12"
              />
              <Button 
                type="submit" 
                disabled={!input.trim() || isLoading || isSimulationComplete}
                className="h-12 w-12 p-0 shrink-0 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
