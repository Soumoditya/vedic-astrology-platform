"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChartData } from '../../lib/astrology/engine';
import { Send, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIAstrologerBotProps {
  chartData: ChartData | null;
}

interface Message {
  role: 'user' | 'model';
  content: string;
}

export const AIAstrologerBot: React.FC<AIAstrologerBotProps> = ({ chartData }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Namaste! I am your AI Jyotish Guru. Provide your birth details, and I shall unveil the cosmic design of your life." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || !chartData) return;
    
    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          chartContext: chartData,
        }),
      });

      if (!response.ok) throw new Error("API Route Failed");
      const data = await response.json();

      setMessages([...newMessages, { role: 'model', content: data.text }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'model', content: "I'm sorry, my cosmic connection was interrupted. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-full border-none shadow-2xl bg-[#080b12]/80 backdrop-blur-xl">
      <CardHeader className="bg-gradient-to-r from-[#0d1323] to-[#080b12] border-b border-white/5 pb-4 rounded-t-xl">
        <CardTitle className="text-xl text-amber-50 flex items-center gap-2 font-serif font-light tracking-wide">
          <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
          AI Jyotish Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-[450px] p-4 text-amber-50/80">
          <div className="space-y-6">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[90%] rounded-2xl p-4 text-sm shadow-xl ${
                    m.role === 'user' 
                      ? 'bg-amber-600/90 text-white rounded-br-none border border-amber-500/50' 
                      : 'bg-white/5 border border-white/10 text-amber-50 rounded-bl-none prose prose-sm prose-invert prose-amber'
                  }`}
                >
                   {m.role === 'model' ? (
                     <ReactMarkdown>{m.content}</ReactMarkdown>
                   ) : (
                     m.content
                   )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl p-4 text-sm bg-white/5 border border-white/10 rounded-bl-none text-amber-200/50 italic flex gap-2 items-center">
                  <Sparkles className="w-4 h-4 animate-spin"/> Consulting the stars...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="p-4 bg-[#0d1323] border-t border-white/5 rounded-b-xl">
        <form 
          className="flex w-full gap-3" 
          onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
        >
          <Input 
            placeholder={chartData ? "Ask about your Kundali..." : "Generate chart first!"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!chartData || loading}
            className="flex-1 bg-white/5 border-white/10 text-amber-50 placeholder:text-white/30 focus-visible:ring-amber-500 rounded-xl"
          />
          <Button 
            type="submit" 
            disabled={!chartData || !input.trim() || loading}
            size="icon"
            className="bg-amber-600 hover:bg-amber-500 text-white shrink-0 rounded-xl shadow-[0_0_15px_rgba(217,119,6,0.5)] transition-all"
          >
            <Send className="w-5 h-5 ml-[2px]" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};
