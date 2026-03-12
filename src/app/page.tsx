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
import { Sparkles, Download, Orbit, Moon } from 'lucide-react';
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
    <div className="min-h-screen font-sans selection:bg-amber-400/30 selection:text-amber-100 relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none mix-blend-color-dodge"></div>
      
      <header className="border-b border-white/10 shadow-[0_4px_30px_rgb(0,0,0,0.5)] sticky top-0 z-50 bg-[#080b12]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Orbit className="text-amber-500 h-7 w-7 animate-[spin_10s_linear_infinite]" />
            <h1 className="text-2xl font-serif font-light text-amber-50 tracking-widest uppercase">Vedic Cosmos</h1>
          </div>
          {chartData && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Button onClick={handleDownloadPDF} variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 gap-2 rounded-xl transition-all">
                <Download className="w-4 h-4 cursor-pointer" />
                Export Real PDF
              </Button>
            </motion.div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4 space-y-8 flex flex-col"
          >
            <BirthDetailsForm onSubmit={handleGenerate} loading={isGenerating} />
            
            <AnimatePresence>
              {chartData && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[#0b0f19]/80 backdrop-blur-xl p-6 rounded-2xl border border-amber-900/40 shadow-2xl flex-1 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl"></div>
                  <h3 className="text-xl font-serif font-light text-amber-100 mb-6 flex items-center gap-2 uppercase tracking-wide border-b border-white/5 pb-4">
                    <Moon className="text-amber-500 w-5 h-5"/> Astrological Profile
                  </h3>
                  
                  <DoshaIndicators chartData={chartData} />
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                       <span className="text-sm text-white/50 uppercase tracking-widest font-bold">Ascendant (Lagna)</span>
                       <span className="text-md text-amber-100 font-medium">{getZodiacSignName(chartData.ascendantSign)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                       <span className="text-sm text-white/50 uppercase tracking-widest font-bold">Moon Sign (Rashi)</span>
                       <span className="text-md text-amber-100 font-medium">{getMoonSign()}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                       <span className="text-sm text-white/50 uppercase tracking-widest font-bold">Mahadasha</span>
                       <span className="text-md text-amber-600 font-bold uppercase">Requires Jhora</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 text-[10px] text-white/30 italic text-center uppercase tracking-widest">
                    Swiss Ephemeris v2.10 (Lahiri Ayanamsa)
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right Column */}
          <div className="lg:col-span-8 space-y-8">
            <AnimatePresence mode="wait">
              {!chartData && !isGenerating && (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[500px] border border-white/10 rounded-3xl flex items-center justify-center bg-gradient-to-br from-white/[0.02] to-transparent backdrop-blur-sm shadow-2xl"
                >
                  <div className="text-center space-y-6 max-w-md mx-auto p-8">
                    <Orbit className="w-16 h-16 text-amber-500/50 mx-auto animate-pulse" />
                    <h3 className="font-serif text-3xl text-amber-50/80 font-light tracking-widest uppercase">The Cosmic Canvas</h3>
                    <p className="text-white/40 leading-relaxed">Provide your precise earthly coordinates in space and time to witness the celestial architecture of your soul.</p>
                  </div>
                </motion.div>
              )}

              {isGenerating && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-[500px] w-full flex flex-col items-center justify-center space-y-6">
                    <Orbit className="animate-spin text-amber-500 w-16 h-16" />
                    <p className="text-amber-500/60 uppercase tracking-widest text-sm font-bold animate-pulse">Calculating Ephemeris Nodes...</p>
                </motion.div>
              )}

              {chartData && !isGenerating && (
                <motion.div key="chart" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: "easeOut" }}>
                  
                  {/* HIDDEN PDF RENDERER (Rendered light mode for clean printing but offscreen normally) */}
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

                  {/* VISIBLE UI METRICS */}
                  <div className="bg-[#0b0f19]/60 backdrop-blur-2xl p-2 rounded-2xl border border-white/5 shadow-2xl relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    
                    <h2 className="text-center font-serif text-xl font-light tracking-widest text-amber-500/80 my-8 uppercase group-hover:text-amber-400 transition-colors">D1 Lagna Kundali</h2>
                    <div className="px-8 pb-10">
                      <KundaliChart chartData={chartData} theme="dark" />
                    </div>
                  </div>

                  <Tabs defaultValue="chat" className="w-full mt-8">
                    <TabsList className="grid w-full grid-cols-2 rounded-xl bg-white/5 border border-white/10 p-1 mb-6">
                      <TabsTrigger value="chat" className="rounded-lg data-[state=active]:bg-amber-600 data-[state=active]:text-white text-white/50 font-bold uppercase tracking-wider text-xs py-3 transition-all">Mystic Chat</TabsTrigger>
                      <TabsTrigger value="divisional" className="rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-white/50 font-bold uppercase tracking-wider text-xs py-3 transition-all">Navamsha Matrix</TabsTrigger>
                    </TabsList>

                    <TabsContent value="chat" className="focus-visible:outline-none focus-visible:ring-0">
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <AIAstrologerBot chartData={chartData} />
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="divisional" className="focus-visible:outline-none focus-visible:ring-0">
                       <div className="bg-[#0b0f19]/80 backdrop-blur-xl p-10 rounded-2xl border border-indigo-900/40 shadow-2xl text-center flex flex-col items-center">
                         <h3 className="font-serif text-2xl font-light text-indigo-300 mb-4 tracking-widest uppercase flex gap-3 items-center"><Orbit className="w-6 h-6"/> Navamsha (D9) Chart</h3>
                         <p className="text-indigo-200/50 text-sm mb-12 max-w-lg leading-relaxed">The D9 harmonizes the raw potential of the D1 chart, analyzing relationship harmony, subtle strengths, and the trajectory of life's later stages.</p>
                         <div className="opacity-60 scale-90 w-full hover:opacity-100 transition-opacity duration-500">
                           <KundaliChart chartData={chartData} theme="dark" />
                         </div>
                       </div>
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
