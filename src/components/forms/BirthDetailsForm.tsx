"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock, Star } from 'lucide-react';

export function BirthDetailsForm({ onSubmit, loading }: { onSubmit: (data: any) => void, loading: boolean }) {
  const [formData, setFormData] = useState({
    name: "John Doe",
    date: "1990-01-01",
    time: "12:00",
    lat: "28.6139",
    lon: "77.2090"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full bg-[#0b0f19]/80 backdrop-blur-xl border border-amber-900/30 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
      <CardHeader className="bg-gradient-to-r from-amber-900/20 to-black/40 border-b border-amber-900/50 pb-5">
        <CardTitle className="text-2xl text-amber-100 font-serif font-light tracking-wide flex gap-2 items-center">
          <Star className="text-amber-500 w-6 h-6"/> Natal Chart Entry
        </CardTitle>
        <CardDescription className="text-amber-100/60 font-medium">Coordinate mapping for precise Ephemeris data</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-amber-50/80 uppercase text-xs tracking-widest">Seeker Name</Label>
            <Input id="name" className="bg-white/5 border-amber-900/40 text-amber-50 placeholder:text-amber-50/30 focus-visible:ring-amber-600 rounded-lg h-11" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-3">
              <Label htmlFor="date" className="text-amber-50/80 uppercase text-xs tracking-widest">Date of Birth</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-amber-500/70" />
                <Input id="date" type="date" className="pl-11 bg-white/5 border-amber-900/40 text-amber-50 focus-visible:ring-amber-600 rounded-lg h-11 [color-scheme:dark]" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="time" className="text-amber-50/80 uppercase text-xs tracking-widest">Time of Birth</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-5 w-5 text-amber-500/70" />
                <Input id="time" type="time" className="pl-11 bg-white/5 border-amber-900/40 text-amber-50 focus-visible:ring-amber-600 rounded-lg h-11 [color-scheme:dark]" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} required />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-3">
              <Label htmlFor="lat" className="text-amber-50/80 uppercase text-xs tracking-widest">Latitude</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-amber-500/70" />
                <Input id="lat" type="text" className="pl-11 bg-white/5 border-amber-900/40 text-amber-50 placeholder:text-amber-50/30 focus-visible:ring-amber-600 rounded-lg h-11" placeholder="28.6139" value={formData.lat} onChange={e => setFormData({...formData, lat: e.target.value})} required />
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="lon" className="text-amber-50/80 uppercase text-xs tracking-widest">Longitude</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-amber-500/70" />
                <Input id="lon" type="text" className="pl-11 bg-white/5 border-amber-900/40 text-amber-50 placeholder:text-amber-50/30 focus-visible:ring-amber-600 rounded-lg h-11" placeholder="77.2090" value={formData.lon} onChange={e => setFormData({...formData, lon: e.target.value})} required />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-black/20 pt-6 pb-6 border-t border-amber-900/30">
          <Button type="submit" disabled={loading} className="w-full h-12 text-md rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-[0_0_20px_rgba(217,119,6,0.3)] transition-all uppercase tracking-widest font-bold">
            {loading ? "Calculating..." : "Generate Kundali"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
