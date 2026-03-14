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
      alert("Error generating accurate chart. Check coordinate input.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;
    try {
      // Temporarily bring to viewport to avoid html2canvas blank rendering bugs
      const el = pdfRef.current;
      el.style.position = 'absolute';
      el.style.left = '0';
      el.style.top = '0';
      el.style.opacity = '1';
      el.style.zIndex = '9999';

      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff", logging: false });
      
      el.style.left = '-9999px';
      el.style.top = '-9999px';
      el.style.opacity = '0';
      el.style.zIndex = '-1';

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Vedic_Astrology_Report.pdf');
    } catch (e) {
      console.error("PDF Export fails:", e);
      alert("Failed to export PDF.");
    }
  };

  const getMoonSign = () => {
    if (!chartData) return "";
    const moon = chartData.planets.find(p => p.name === 'Moon');
    return moon ? getZodiacSignName(moon.sign) : "";
  };

  return (
    <div className="min-h-screen font-sans selection:bg-[#D4AF37]/30 selection:text-[#D4AF37] relative bg-[#0A0A0A]">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none mix-blend-screen"></div>
      
      <header className="border-b border-[#D4AF37]/20 shadow-lg sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Orbit className="text-[#D4AF37] h-8 w-8 animate-[spin_15s_linear_infinite]" />
            <h1 className="text-3xl font-serif text-[#D4AF37] tracking-[0.2em] uppercase">Vedic Cosmos</h1>
          </div>
          {chartData && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Button onClick={handleDownloadPDF} variant="outline" className="border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#F3E5AB] gap-2 rounded-none transition-all h-10 px-6 text-xs uppercase tracking-[0.15em] font-semibold bg-transparent">
                <Download className="w-4 h-4" />
                Export Real PDF
              </Button>
            </motion.div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-16 relative z-10 hidden-scrollbar">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
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
                  className="h-full min-h-[600px] border border-[#D4AF37]/10 rounded-sm flex items-center justify-center bg-[#111111]/80 backdrop-blur-md shadow-2xl"
                >
                  <div className="text-center space-y-6 max-w-md mx-auto p-8">
                    <Orbit className="w-20 h-20 text-[#D4AF37]/40 mx-auto animate-[pulse_5s_ease-in-out_infinite]" />
                    <h3 className="font-serif text-3xl text-stone-200 tracking-widest uppercase">The Cosmic Canvas</h3>
                    <p className="text-stone-400/80 leading-relaxed text-sm font-light">Input your earthly coordinates in space and time to decode the celestial architecture of your birth.</p>
                  </div>
                </motion.div>
              )}

              {isGenerating && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full min-h-[600px] w-full flex flex-col items-center justify-center space-y-8 border border-[#D4AF37]/10 rounded-sm bg-[#111111]/80 backdrop-blur-md shadow-2xl">
                    <Orbit className="animate-spin text-[#D4AF37] w-16 h-16" />
                    <p className="text-[#D4AF37]/80 uppercase tracking-widest text-sm font-bold animate-pulse">Computing Ephemeris Nodes...</p>
                </motion.div>
              )}

              {chartData && !isGenerating && (
                <motion.div key="tabs" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  
                  {/* HIDDEN EXPORT ZONE CAREFULLY FORMATTED */}
                  <div className="absolute top-[-9999px] left-[-9999px] opacity-0" style={{ zIndex: -1 }}>
                    <div ref={pdfRef} className="w-[850px] bg-white p-16 relative flex flex-col pointer-events-none">
                       <h1 className="font-serif text-4xl text-center text-[#2C3E50] tracking-[0.2em] uppercase mb-4">Vedic Cosmos</h1>
                       <div className="h-[2px] w-full bg-[#D4AF37] mb-12"></div>
                       
                       <h2 className="text-lg font-bold text-[#2C3E50] uppercase tracking-[0.1em] mb-4 text-center">Lagna Kundali (D1 Chart)</h2>
                       <div className="w-[600px] h-[600px] mx-auto mb-16">
                         <KundaliChart chartData={chartData} theme="light" />
                       </div>
                       
                       <h2 className="text-lg font-bold text-[#2C3E50] uppercase tracking-[0.1em] mb-6 text-center">Astrological Profile</h2>
                       <div className="grid grid-cols-2 gap-8 mb-8 text-[#2C3E50]">
                         <div className="p-6 border border-gray-200">
                           <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Ascendant (Lagna)</p>
                           <p className="text-xl font-serif">{getZodiacSignName(chartData.ascendantSign)}</p>
                         </div>
                         <div className="p-6 border border-gray-200">
                           <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Moon Sign (Rashi)</p>
                           <p className="text-xl font-serif">{getMoonSign()}</p>
                         </div>
                       </div>
                       <div className="border border-gray-200 p-6 bg-gray-50">
                         <DoshaIndicators chartData={chartData} />
                       </div>
                    </div>
                  </div>

                  <Tabs defaultValue="chart" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 rounded-none bg-[#111111] border-b border-[#D4AF37]/20 p-0 mb-8 h-14 shadow-md">
                      <TabsTrigger value="chart" className="rounded-none whitespace-nowrap data-[state=active]:bg-[#D4AF37]/10 data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] data-[state=active]:text-[#D4AF37] text-stone-500 font-bold uppercase tracking-widest text-xs py-4 transition-all gap-2"><Star className="w-4 h-4 hidden md:block" /> Chart View</TabsTrigger>
                      <TabsTrigger value="profile" className="rounded-none whitespace-nowrap data-[state=active]:bg-[#D4AF37]/10 data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] data-[state=active]:text-[#D4AF37] text-stone-500 font-bold uppercase tracking-widest text-xs py-4 transition-all gap-2"><Moon className="w-4 h-4 hidden md:block" /> Profile Data</TabsTrigger>
                      <TabsTrigger value="ai" className="rounded-none whitespace-nowrap data-[state=active]:bg-[#D4AF37]/10 data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] data-[state=active]:text-[#D4AF37] text-stone-500 font-bold uppercase tracking-widest text-xs py-4 transition-all gap-2"><MessageCircle className="w-4 h-4 hidden md:block" /> AI Astrologer</TabsTrigger>
                    </TabsList>

                    <TabsContent value="chart" className="focus-visible:outline-none focus-visible:ring-0 mt-0">
                      <div className="bg-[#111111]/80 backdrop-blur-xl p-8 md:p-12 rounded-sm border border-[#D4AF37]/20 shadow-2xl relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <h2 className="text-center font-serif text-2xl font-light tracking-[0.2em] text-[#D4AF37] mb-12 uppercase group-hover:text-[#F3E5AB] transition-colors">D1 Lagna Kundali</h2>
                        <KundaliChart chartData={chartData} theme="dark" />
                      </div>
                    </TabsContent>

                    <TabsContent value="profile" className="focus-visible:outline-none focus-visible:ring-0 mt-0">
                      <div className="bg-[#111111]/80 backdrop-blur-xl p-8 md:p-12 rounded-sm border border-[#D4AF37]/20 shadow-2xl flex-1 relative overflow-hidden min-h-[600px]">
                        <h3 className="text-xl md:text-2xl font-serif font-light text-[#D4AF37] mb-10 flex items-center gap-4 uppercase tracking-[0.1em] border-b border-[#D4AF37]/20 pb-6">
                          <Moon className="text-[#D4AF37] w-6 h-6"/> Natal Alignments
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                          <div className="flex flex-col border border-[#D4AF37]/10 p-6 bg-[#0A0A0A]/50 group hover:border-[#D4AF37]/30 transition-colors">
                             <span className="text-xs text-stone-500 uppercase tracking-[0.2em] font-bold mb-2">Ascendant (Lagna)</span>
                             <span className="text-2xl text-stone-200 font-serif tracking-wide">{getZodiacSignName(chartData.ascendantSign)}</span>
                          </div>
                          <div className="flex flex-col border border-[#D4AF37]/10 p-6 bg-[#0A0A0A]/50 group hover:border-[#D4AF37]/30 transition-colors">
                             <span className="text-xs text-stone-500 uppercase tracking-[0.2em] font-bold mb-2">Moon Sign (Rashi)</span>
                             <span className="text-2xl text-stone-200 font-serif tracking-wide">{getMoonSign()}</span>
                          </div>
                        </div>

                        <div className="mb-10">
                          <h4 className="text-sm text-stone-500 uppercase tracking-[0.1em] font-bold mb-6">Astrological Formations</h4>
                          <DoshaIndicators chartData={chartData} />
                        </div>
                        
                        <div className="absolute bottom-6 left-0 right-0 text-[10px] text-stone-600 italic text-center uppercase tracking-[0.3em]">
                          Powered by Astronomy-Engine J2000
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="ai" className="focus-visible:outline-none focus-visible:ring-0 mt-0">
                      <div className="rounded-sm border border-[#D4AF37]/20 shadow-2xl overflow-hidden min-h-[600px] bg-[#111111]/80 backdrop-blur-xl">
                         <div className="p-6 border-b border-[#D4AF37]/20">
                            <h3 className="text-xl font-serif font-light text-[#D4AF37] flex items-center gap-4 uppercase tracking-[0.1em]">
                              <MessageCircle className="text-[#D4AF37] w-5 h-5"/> Divine Oracle
                            </h3>
                         </div>
                         <div className="p-4 md:p-6 bg-transparent">
                            <AIAstrologerBot chartData={chartData} />
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
