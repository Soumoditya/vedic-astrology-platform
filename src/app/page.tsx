"use client";

import { useState, useRef } from 'react';
import { BirthDetailsForm } from '@/components/forms/BirthDetailsForm';
import { KundaliChart } from '@/components/astrology/KundaliChart';
import { AIAstrologerBot } from '@/components/chat/AIAstrologerBot';
import { DoshaIndicators } from '@/components/astrology/DoshaIndicators';
import { ChartData } from '@/lib/astrology/engine';
import { generateAccurateChart } from '@/app/actions/calculateChart';
import { getZodiacSignName } from '@/lib/astrology/mathUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Orbit, Moon, Star, MessageCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async (formData: any) => {
    setIsGenerating(true);
    setChartData(null);
    try {
      const dateString = formData.date + 'T' + formData.time + ':00Z';
      const parsedDate = new Date(dateString);
      
      const data = await generateAccurateChart(parsedDate, parseFloat(formData.lat), parseFloat(formData.lon));
      setChartData(data);
    } catch (e) {
      console.error(e);
      alert("Error generating accurate chart. Native engine binding failed or location coordinates invalid. Check console.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;
    const canvas = await html2canvas(pdfRef.current, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('Vedic_Kundali.pdf');
  };

  const getMoonSign = () => {
    if (!chartData) return "";
    const moon = chartData.planets.find(p => p.name === 'Moon');
    return moon ? getZodiacSignName(moon.sign) : "";
  };

  return (
    <div className="min-h-screen font-sans selection:bg-amber-400/30 selection:text-amber-100 relative bg-[#05080f]">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none mix-blend-color-dodge"></div>
      
      <header className="border-b border-white/10 shadow-[0_4px_30px_rgb(0,0,0,0.5)] sticky top-0 z-50 bg-[#080b12]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Orbit className="text-amber-500 h-7 w-7 animate-[spin_10s_linear_infinite]" />
            <h1 className="text-2xl font-serif font-light text-amber-50 tracking-widest uppercase">Vedic Cosmos</h1>
          </div>
          {chartData && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Button onClick={handleDownloadPDF} variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 gap-2 rounded-xl transition-all h-9 text-xs uppercase tracking-widest">
                <Download className="w-4 h-4 cursor-pointer" />
                Export Real PDF
              </Button>
            </motion.div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 relative z-10 hidden-scrollbar">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4 space-y-8 flex flex-col"
          >
            <BirthDetailsForm onSubmit={handleGenerate} loading={isGenerating} />
          </motion.div>

          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {!chartData && !isGenerating && (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[500px] border border-white/5 rounded-3xl flex items-center justify-center bg-[#0b0f19]/40 backdrop-blur-sm shadow-2xl"
                >
                  <div className="text-center space-y-6 max-w-md mx-auto p-8">
                    <Orbit className="w-16 h-16 text-amber-500/50 mx-auto animate-[pulse_4s_ease-in-out_infinite]" />
                    <h3 className="font-serif text-3xl text-amber-50/80 font-light tracking-widest uppercase">The Cosmic Canvas</h3>
                    <p className="text-white/40 leading-relaxed text-sm">Provide your precise earthly coordinates in space and time to witness the celestial architecture of your soul.</p>
                  </div>
                </motion.div>
              )}

              {isGenerating && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full min-h-[500px] w-full flex flex-col items-center justify-center space-y-6 border border-white/5 rounded-3xl bg-[#0b0f19]/40 backdrop-blur-sm shadow-2xl">
                    <Orbit className="animate-spin text-amber-500 w-16 h-16" />
                    <p className="text-amber-500/60 uppercase tracking-widest text-sm font-bold animate-pulse">Calculating Ephemeris Nodes...</p>
                </motion.div>
              )}

              {chartData && !isGenerating && (
                <motion.div key="tabs" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  
                  <div className="absolute top-[-9999px] left-[-9999px]">
                    <div ref={pdfRef} className="w-[800px] bg-white p-12 relative flex flex-col items-center">
                       <h2 className="font-serif text-3xl font-bold tracking-widest text-amber-900 mb-2 uppercase">Vedic Cosmos</h2>
                       <p className="text-sm font-bold text-amber-700 uppercase tracking-widest mb-10">Lagna Kundali (D1)</p>
                       <div className="w-[600px] h-[600px]">
                         <KundaliChart chartData={chartData} theme="light" />
                       </div>
                       <div className="mt-12 text-center text-xs text-amber-800/60 tracking-[0.2em]">GENERATED VIA SWISS EPHEMERIS MATH</div>
                    </div>
                  </div>

                  <Tabs defaultValue="chart" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 rounded-xl bg-[#0b0f19]/80 backdrop-blur-xl border border-white/10 p-1.5 mb-8 h-14 shadow-2xl overflow-x-auto">
                      <TabsTrigger value="chart" className="rounded-lg whitespace-nowrap data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-400 text-white/50 font-bold uppercase tracking-widest text-[10px] md:text-xs py-2.5 transition-all gap-2"><Star className="w-4 h-4 hidden md:block" /> Chart View</TabsTrigger>
                      <TabsTrigger value="profile" className="rounded-lg whitespace-nowrap data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-400 text-white/50 font-bold uppercase tracking-widest text-[10px] md:text-xs py-2.5 transition-all gap-2"><Moon className="w-4 h-4 hidden md:block" /> Astrological Profile</TabsTrigger>
                      <TabsTrigger value="ai" className="rounded-lg whitespace-nowrap data-[state=active]:bg-indigo-600/20 data-[state=active]:text-indigo-400 text-white/50 font-bold uppercase tracking-widest text-[10px] md:text-xs py-2.5 transition-all gap-2"><MessageCircle className="w-4 h-4 hidden md:block" /> AI Astrologer</TabsTrigger>
                    </TabsList>

                    <TabsContent value="chart" className="focus-visible:outline-none focus-visible:ring-0 mt-0">
                      <div className="bg-[#0b0f19]/80 backdrop-blur-2xl p-6 md:p-10 rounded-3xl border border-white/5 shadow-2xl relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <h2 className="text-center font-serif text-xl font-light tracking-widest text-amber-500/80 mb-10 uppercase group-hover:text-amber-400 transition-colors">D1 Lagna Kundali</h2>
                        <KundaliChart chartData={chartData} theme="dark" />
                      </div>
                    </TabsContent>

                    <TabsContent value="profile" className="focus-visible:outline-none focus-visible:ring-0 mt-0">
                      <div className="bg-[#0b0f19]/80 backdrop-blur-2xl p-8 rounded-3xl border border-purple-900/30 shadow-2xl flex-1 relative overflow-hidden min-h-[500px]">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
                        <h3 className="text-xl md:text-2xl font-serif font-light text-purple-100 mb-8 flex items-center gap-3 uppercase tracking-widest border-b border-white/5 pb-6">
                          <Moon className="text-purple-500 w-6 h-6"/> Natal Alignments
                        </h3>
                        
                        <div className="mb-10">
                          <DoshaIndicators chartData={chartData} />
                        </div>
                        
                        <div className="space-y-6 max-w-2xl">
                          <div className="flex justify-between items-center border-b border-white/5 pb-4">
                             <span className="text-xs text-white/40 uppercase tracking-[0.3em] font-bold">Ascendant (Lagna)</span>
                             <span className="text-lg text-purple-100 font-serif tracking-wide">{getZodiacSignName(chartData.ascendantSign)}</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-white/5 pb-4">
                             <span className="text-xs text-white/40 uppercase tracking-[0.3em] font-bold">Moon Sign (Rashi)</span>
                             <span className="text-lg text-purple-100 font-serif tracking-wide">{getMoonSign()}</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-white/5 pb-4">
                             <span className="text-xs text-white/40 uppercase tracking-[0.3em] font-bold">Primary Mahadasha</span>
                             <span className="text-sm text-purple-400 font-bold uppercase tracking-widest bg-purple-900/20 px-3 py-1 rounded-full">Requires Jhora</span>
                          </div>
                        </div>

                        <div className="absolute bottom-6 left-0 right-0 text-[10px] text-white/20 italic text-center uppercase tracking-[0.3em]">
                          Swiss Ephemeris v2.10 (Lahiri Ayanamsa)
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="ai" className="focus-visible:outline-none focus-visible:ring-0 mt-0">
                      <AIAstrologerBot chartData={chartData} />
                    </TabsContent>

                  </Tabs>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
