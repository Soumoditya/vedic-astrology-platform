"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock, Star, User, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function BirthDetailsForm({ onSubmit, loading }: { onSubmit: (data: any) => void, loading: boolean }) {
  const [formData, setFormData] = useState({
    name: "John Doe",
    date: "1990-01-01",
    timeHour: "12",
    timeMinute: "00",
    timeAmPm: "PM",
    lat: "28.6139",
    lon: "77.2090",
    gender: "Male",
    locationName: "New Delhi, Delhi, India"
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=5`);
        const data = await res.json();
        setSearchResults(data);
        setShowDropdown(true);
      } catch (error) {
        console.error("Geocoding error", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  const selectLocation = (place: any) => {
    setFormData({
      ...formData,
      lat: place.lat,
      lon: place.lon,
      locationName: place.display_name
    });
    setSearchQuery("");
    setShowDropdown(false);
  };

  const handleTimeChange = (type: 'hour' | 'minute' | 'ampm', value: string) => {
    setFormData({ ...formData, [type === 'hour' ? 'timeHour' : type === 'minute' ? 'timeMinute' : 'timeAmPm']: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse the 12-hour AM/PM into 24-hour string for the engine
    let h = parseInt(formData.timeHour);
    if (formData.timeAmPm === "PM" && h !== 12) h += 12;
    if (formData.timeAmPm === "AM" && h === 12) h = 0;
    
    const time24 = `${h.toString().padStart(2, '0')}:${formData.timeMinute.padStart(2, '0')}`;
    
    onSubmit({
      ...formData,
      time: time24
    });
  };

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  return (
    <Card className="w-full bg-[#0b0f19]/80 backdrop-blur-xl border border-amber-900/30 overflow-visible shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
      <CardHeader className="bg-gradient-to-r from-amber-900/20 to-black/40 border-b border-amber-900/50 pb-5">
        <CardTitle className="text-2xl text-amber-100 font-serif font-light tracking-wide flex gap-2 items-center">
          <Star className="text-amber-500 w-6 h-6"/> Natal Chart Entry
        </CardTitle>
        <CardDescription className="text-amber-100/60 font-medium">Precise coordinates for precise Astrology</CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-amber-50/80 uppercase text-xs tracking-widest">Seeker Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-amber-500/70" />
                <Input id="name" className="pl-11 bg-white/5 border-amber-900/40 text-amber-50 placeholder:text-amber-50/30 focus-visible:ring-amber-600 rounded-lg h-11" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="gender" className="text-amber-50/80 uppercase text-xs tracking-widest">Gender</Label>
              <Select value={formData.gender} onValueChange={(v) => setFormData({...formData, gender: v || ""})}>
                <SelectTrigger className="bg-white/5 border-amber-900/40 text-amber-50 h-11">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent className="bg-[#0b0f19] border-amber-900/50 text-amber-50">
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="date" className="text-amber-50/80 uppercase text-xs tracking-widest">Date of Birth</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-amber-500/70" />
              <Input id="date" type="date" className="pl-11 bg-white/5 border-amber-900/40 text-amber-50 focus-visible:ring-amber-600 rounded-lg h-11 [color-scheme:dark]" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label className="text-amber-50/80 uppercase text-xs tracking-widest block">Time of Birth</Label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Clock className="absolute left-3 top-3 h-5 w-5 text-amber-500/70 z-10" />
                <Select value={formData.timeHour} onValueChange={(v) => handleTimeChange('hour', v || "")}>
                  <SelectTrigger className="pl-11 bg-white/5 border-amber-900/40 text-amber-50 h-11">
                    <SelectValue placeholder="HH" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0b0f19] border-amber-900/50 text-amber-50 h-[200px]">
                    {hours.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select value={formData.timeMinute} onValueChange={(v) => handleTimeChange('minute', v || "")}>
                  <SelectTrigger className="bg-white/5 border-amber-900/40 text-amber-50 h-11">
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0b0f19] border-amber-900/50 text-amber-50 h-[200px]">
                    {minutes.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[100px]">
                <Select value={formData.timeAmPm} onValueChange={(v) => handleTimeChange('ampm', v || "")}>
                  <SelectTrigger className="bg-white/5 border-amber-900/40 text-amber-50 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0b0f19] border-amber-900/50 text-amber-50">
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="search" className="text-amber-50/80 uppercase text-xs tracking-widest">Birth City / Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-amber-500/70" />
              <Input 
                id="search" 
                type="text" 
                className="pl-11 bg-white/5 border-amber-900/40 text-amber-50 placeholder:text-amber-50/30 focus-visible:ring-amber-600 rounded-lg h-11" 
                placeholder="Search city e.g. New York..." 
                value={searchQuery || (showDropdown ? "" : formData.locationName.split(',')[0])} 
                onChange={e => {
                  setSearchQuery(e.target.value);
                  if (!showDropdown) setShowDropdown(true);
                }}
                onFocus={() => {
                  if (formData.locationName && !searchQuery) setSearchQuery("");
                }}
              />
              {isSearching && <Loader2 className="absolute right-3 top-3 h-5 w-5 text-amber-500/50 animate-spin" />}
              
              {showDropdown && searchResults.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-[#0b0f19] border border-amber-900/50 rounded-lg shadow-2xl overflow-hidden text-sm">
                  {searchResults.map((place, idx) => (
                    <div 
                      key={idx} 
                      className="px-4 py-3 hover:bg-amber-900/30 cursor-pointer text-amber-50/80 transition-colors border-b border-white/5 last:border-0"
                      onClick={() => selectLocation(place)}
                    >
                      {place.display_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-between text-[10px] text-amber-100/30 uppercase tracking-widest mt-1 font-bold">
              <span>LAT: {parseFloat(formData.lat).toFixed(4)}</span>
              <span>LON: {parseFloat(formData.lon).toFixed(4)}</span>
            </div>
          </div>
          
        </CardContent>
        <CardFooter className="bg-black/20 pt-6 pb-6 border-t border-amber-900/30">
          <Button type="submit" disabled={loading} className="w-full h-12 text-md rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-[0_0_20px_rgba(217,119,6,0.3)] transition-all uppercase tracking-widest font-bold">
            {loading ? <span className="flex items-center gap-2"><Loader2 className="animate-spin w-5 h-5"/> Calculating...</span> : "Generate Kundali"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
