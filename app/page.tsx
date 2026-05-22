"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// --- Types ---
type FormData = {
  cpu: string;
  gpu: string;
  ramSize: string;
  resolution: string; 
  emulator: string;
  game: string;
  // Custom Overrides (Optional)
  customRam: string;
  customDpi: string;
  customResolution: string;
};

type ResultData = {
  dpi: number;
  sensitivityX: string; 
  sensitivityY: string; 
  ram: string;
  engine: string;
  tips: string[];
} | null;

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);

  // --- State Management (Hybrid Defaults) ---
  const [formData, setFormData] = useState<FormData>({
    cpu: "i5-old",
    gpu: "gt-730",
    ramSize: "none", 
    resolution: "none", 
    emulator: "memu",
    game: "freefire",
    customRam: "",
    customDpi: "",
    customResolution: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<ResultData>(null);

  // --- GSAP Mouse Follower (The Glow Effect) ---
  useGSAP(() => {
    const xTo = gsap.quickTo(cursorGlowRef.current, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(cursorGlowRef.current, "y", { duration: 0.6, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, { scope: containerRef });

  // --- GSAP Animations ---
  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo(".animate-el", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power4.out", delay: 0.2 });
    tl.fromTo(".animate-card-el", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }, "-=0.4");
  }, { scope: containerRef });

  useGSAP(() => {
    if (results) {
      gsap.fromTo(".result-card", { y: 50, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)", stagger: 0.1 });
    }
  }, { dependencies: [results], scope: containerRef });

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (results) setResults(null); 
  };

  // --- THE BRAIN: DYNAMIC HYBRID ENGINE v7.0 (Perfect Medium Math) ---
  const calculateSettings = () => {
    setIsGenerating(true);
    setResults(null);

    setTimeout(() => {
      const lowEndGpus = ["gt-730", "intel-hd", "intel-uhd", "amd-vega", "gt-1030", "r7"];
      const midTierGpus = ["gtx-750ti", "gtx-1050ti", "gtx-1650", "rx-570"];

      let gpuScore = lowEndGpus.includes(formData.gpu) ? 1 : midTierGpus.includes(formData.gpu) ? 2 : 3;
      let calcTips: string[] = ["Pro Tip: Use a clean mousepad for best tracking consistency."];

      // 1. HYBRID RAM ALLOCATION
      let calcRam = "";
      if (formData.customRam.trim() !== "") {
        let numericRam = parseFloat(formData.customRam);
        if (!isNaN(numericRam) && numericRam > 0) {
          let allocatedMb = Math.round((numericRam * 1024) / 2); // Allocate half the RAM safely
          calcRam = `${allocatedMb} MB (Custom Optimized)`;
          if (numericRam <= 4) calcTips.push("WARNING: Low custom RAM. Close background apps.");
        } else {
          calcRam = "4096 MB (Fallback)";
        }
      } else {
        if (formData.ramSize === "4gb") {
          calcRam = "1536 MB - 2048 MB (Max)";
          calcTips.push("WARNING: You only have 4GB RAM. Close other apps before playing!");
        } else if (formData.ramSize === "8gb") {
          calcRam = "4096 MB (Optimal)";
        } else if (formData.ramSize === "16gb" || formData.ramSize === "32gb") {
          calcRam = "4096 MB - 8192 MB (Maximum)";
        } else if (formData.ramSize === "none") {
          calcRam = "4096 MB (Default Fallback)";
        }
      }

      // 2. RENDER ENGINE LOGIC
      let calcEngine = gpuScore >= 2 ? "OpenGL (Best for Dedicated GPUs)" : "DirectX (Smoother for Older/Integrated GPUs)";
      if (gpuScore >= 2) calcTips.push("Enable 'Prefer Dedicated GPU' in emulator settings.");
      else calcTips.push("Lower in-game graphics to 'Smooth' to avoid frame drops.");

      // 3. HYBRID RESOLUTION & DPI LOGIC
      let calcDpi = 240;
      let baseResolution = "720p";

      // Fix for "1280x720" texts
      if (formData.customResolution.trim() !== "") {
        let resString = formData.customResolution.toLowerCase();
        if (resString.includes("1080")) baseResolution = "1080p";
        else if (resString.includes("900")) baseResolution = "900p";
        else baseResolution = "720p";
      } else {
        if (formData.resolution === "none") baseResolution = "720p";
        else baseResolution = formData.resolution;
      }

      if (formData.customDpi.trim() !== "") {
        let numericDpi = parseInt(formData.customDpi);
        if (!isNaN(numericDpi) && numericDpi > 0) {
          calcDpi = numericDpi; 
        }
      } else {
        if (gpuScore === 1) calcDpi = baseResolution === "1080p" ? 320 : 240; 
        else calcDpi = baseResolution === "1080p" ? 440 : 320; 
      }

      // 4. THE PERFECT MEDIUM MATH (Square Root Curve)
      let rawSensX = 1.0; 
      let rawSensY = 1.0;
      
      // These bases are perfect for 240 DPI.
      let baseMultiplierX = formData.game === "freefire" ? 1.4 : 0.9;
      let baseMultiplierY = formData.game === "freefire" ? 1.8 : 1.0; 

      if (formData.game === "freefire") calcTips.push("FreeFire: Keep in-game General sensitivity at 95-100.");
      
      // The Magic Curve: sqrt softens the drop so it doesn't become extremely low
      let dpiScaleFactor = Math.sqrt(240 / calcDpi); 
      
      rawSensX = baseMultiplierX * dpiScaleFactor;
      rawSensY = baseMultiplierY * dpiScaleFactor;

      rawSensX = Math.max(rawSensX, 0.1);
      rawSensY = Math.max(rawSensY, 0.1);

      // 5. EMULATOR SPECIFIC FORMATTING
      let formattedX = "";
      let formattedY = "";

      if (formData.emulator === "bluestacks") {
        formattedX = rawSensX.toFixed(2); 
        formattedY = rawSensY.toFixed(2); 
        calcTips.push("BlueStacks: Use tweak '16450' or '21058' for stable aim.");
      } else if (formData.emulator === "memu") {
        // Multiplier 36 maps perfectly: rawX 1.4 -> ~50%, rawY 1.8 -> ~65% (The sweet spot)
        let percentX = Math.round(rawSensX * 36); 
        let percentY = Math.round(rawSensY * 36);
        
        formattedX = Math.min(Math.max(percentX, 10), 90) + "%";
        formattedY = Math.min(Math.max(percentY, 10), 95) + "%";
        calcTips.push("MEmu: Drag the keymapping sliders exactly to these percentages.");
      } else if (formData.emulator === "smartgaga") {
        formattedX = (rawSensX * 2.0).toFixed(1); 
        formattedY = (rawSensY * 2.0).toFixed(1);
        calcTips.push("SmartGaga: Keep mouse polling rate at 500Hz maximum.");
      }

      setResults({
        dpi: calcDpi,
        sensitivityX: formattedX,
        sensitivityY: formattedY,
        ram: calcRam,
        engine: calcEngine,
        tips: calcTips,
      });

      setIsGenerating(false);
    }, 1500);
  };

  return (
    <main 
      ref={containerRef} 
      className="min-h-screen bg-neutral-950 text-white selection:bg-emerald-500 selection:text-neutral-900 relative overflow-x-hidden pb-24"
    >
      {/* MOUSE GLOW */}
      <div 
        ref={cursorGlowRef} 
        className="fixed top-0 left-0 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0 hidden md:block"
      ></div>

      {/* Cyberpunk Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-3/4 h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* Content Area */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24 flex flex-col items-center text-center">
        
        <div className="animate-el inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Engine v7.0 Perfect Math
        </div>

        <h1 className="animate-el text-5xl md:text-7xl font-black tracking-tighter mb-6">
          Unlock Maximum <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            Gaming Performance
          </span>
        </h1>

        <p className="animate-el text-neutral-400 max-w-2xl text-lg mb-12 font-medium">
          Get the perfect X/Y sensitivity, exact RAM allocation, and Windows tweaks for your exact hardware. Play like a pro, even on a low-end PC.
        </p>

        {/* Master Tool Card */}
        <div className="animate-el w-full max-w-5xl bg-neutral-900/40 backdrop-blur-2xl border border-neutral-800 rounded-3xl p-8 shadow-2xl relative mb-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left mb-10">
            
            <div className="animate-card-el space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Processor (CPU)</label>
              <select name="cpu" value={formData.cpu} onChange={handleInputChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3.5 text-neutral-200 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer">
                <optgroup label="Low End (Older Gens)">
                  <option value="core2">Intel Core 2 Duo / Quad</option>
                  <option value="i3-old">Intel i3 (2nd - 5th Gen)</option>
                  <option value="i5-old">Intel i5 (2nd - 4th Gen)</option>
                  <option value="amd-a">AMD A-Series</option>
                </optgroup>
                <optgroup label="Mid Range">
                  <option value="i3-new">Intel i3 (8th Gen+)</option>
                  <option value="i5-mid">Intel i5 (6th - 9th Gen)</option>
                  <option value="ryzen-3">AMD Ryzen 3 (Any)</option>
                </optgroup>
              </select>
            </div>

            <div className="animate-card-el space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Graphic Card (GPU)</label>
              <select name="gpu" value={formData.gpu} onChange={handleInputChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3.5 text-neutral-200 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer">
                <optgroup label="Integrated / Very Low">
                  <option value="intel-hd">Intel HD Graphics</option>
                  <option value="gt-730">NVIDIA GT 710 / 730</option>
                </optgroup>
                <optgroup label="Budget Dedicated">
                  <option value="gtx-750ti">NVIDIA GTX 750 Ti</option>
                  <option value="gtx-1050ti">NVIDIA GTX 1050 / Ti</option>
                  <option value="gtx-1650">NVIDIA GTX 1650</option>
                </optgroup>
              </select>
            </div>

            <div className="animate-card-el space-y-2">
              <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Total PC RAM (Presets)</label>
              <select name="ramSize" value={formData.ramSize} onChange={handleInputChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3.5 text-neutral-200 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer">
                <option value="none">None (Use Custom Below)</option>
                <option value="4gb">4 GB RAM (Low)</option>
                <option value="8gb">8 GB RAM (Standard)</option>
                <option value="16gb">16 GB RAM (Good)</option>
                <option value="32gb">32 GB+ RAM (Beast)</option>
              </select>
            </div>

            <div className="animate-card-el space-y-2">
              <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Screen Resolution (Presets)</label>
              <select name="resolution" value={formData.resolution} onChange={handleInputChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3.5 text-neutral-200 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer">
                <option value="none">None (Use Custom Below)</option>
                <option value="720p">720p (1280x720) - Fast</option>
                <option value="900p">900p (1600x900) - Balanced</option>
                <option value="1080p">1080p (1920x1080) - HD</option>
              </select>
            </div>

            <div className="animate-card-el space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Emulator</label>
              <select name="emulator" value={formData.emulator} onChange={handleInputChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3.5 text-neutral-200 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer">
                <option value="memu">MEmu Player</option>
                <option value="bluestacks">BlueStacks 5</option>
                <option value="smartgaga">SmartGaga</option>
              </select>
            </div>

            <div className="animate-card-el space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Target Game</label>
              <select name="game" value={formData.game} onChange={handleInputChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3.5 text-neutral-200 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer">
                <option value="freefire">Free Fire</option>
                <option value="bgmi">BGMI / PUBG</option>
                <option value="codm">Call of Duty Mobile</option>
              </select>
            </div>
          </div>

          <div className="border-t border-neutral-800/60 pt-6 text-left">
            <h3 className="text-emerald-400 font-bold text-sm uppercase tracking-widest mb-4 pl-2">
              Custom Overrides (Hybrid Mode)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <input 
                  type="text" 
                  name="customRam"
                  value={formData.customRam}
                  onChange={handleInputChange}
                  placeholder="Custom RAM (e.g. 12)" 
                  className="w-full bg-neutral-950/80 border border-neutral-800 rounded-full px-5 py-3 text-sm text-neutral-200 focus:ring-2 focus:ring-emerald-500 outline-none placeholder-neutral-600 transition-all"
                />
              </div>
              <div className="space-y-1">
                <input 
                  type="text" 
                  name="customDpi"
                  value={formData.customDpi}
                  onChange={handleInputChange}
                  placeholder="Custom Mouse DPI (e.g. 800)" 
                  className="w-full bg-neutral-950/80 border border-neutral-800 rounded-full px-5 py-3 text-sm text-neutral-200 focus:ring-2 focus:ring-emerald-500 outline-none placeholder-neutral-600 transition-all"
                />
              </div>
              <div className="space-y-1">
                <input 
                  type="text" 
                  name="customResolution"
                  value={formData.customResolution}
                  onChange={handleInputChange}
                  placeholder="Custom Res (e.g. 1280x720)" 
                  className="w-full bg-neutral-950/80 border border-neutral-800 rounded-full px-5 py-3 text-sm text-neutral-200 focus:ring-2 focus:ring-emerald-500 outline-none placeholder-neutral-600 transition-all"
                />
              </div>
            </div>
          </div>

          {!results && (
            <button 
              onClick={calculateSettings}
              disabled={isGenerating}
              className="animate-card-el mt-8 w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition-colors duration-300 relative z-20"
            >
              {isGenerating ? (
                <>
                  <span className="w-5 h-5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin"></span>
                  Calculating Hybrid Engine Physics...
                </>
              ) : (
                "Generate Pro Settings"
              )}
            </button>
          )}

          {results && (
             <div className="mt-8 text-center text-neutral-500 text-sm animate-pulse">
                Change any hardware option above to recalculate settings.
             </div>
          )}
        </div>

        {results && (
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 text-left relative z-10">
            
            <div className="result-card col-span-1 md:col-span-3 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-xl font-black text-emerald-400 mb-2">Calculated Sensitivity Config</h3>
              <p className="text-neutral-400 text-sm mb-6">
                Mathematically scaled based on your custom environment specs and hardware benchmarks.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-neutral-950/50 p-4 rounded-xl border border-neutral-800">
                  <div className="text-neutral-500 text-xs font-bold uppercase mb-1">DPI</div>
                  <div className="text-3xl font-black text-white">{results.dpi}</div>
                </div>
                <div className="bg-neutral-950/50 p-4 rounded-xl border border-neutral-800">
                  <div className="text-neutral-500 text-xs font-bold uppercase mb-1">Sens X</div>
                  <div className="text-3xl font-black text-white">{results.sensitivityX}</div>
                </div>
                <div className="bg-neutral-950/50 p-4 rounded-xl border border-neutral-800">
                  <div className="text-neutral-500 text-xs font-bold uppercase mb-1">Sens Y</div>
                  <div className="text-3xl font-black text-emerald-400">{results.sensitivityY}</div>
                </div>
              </div>
            </div>

            <div className="result-card col-span-1 md:col-span-2 bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-lg font-bold text-white mb-4">Emulator Engine Settings</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                  <span className="text-neutral-400">Render Engine</span>
                  <span className="font-semibold text-cyan-400 text-right">{results.engine}</span>
                </div>
                <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                  <span className="text-neutral-400">RAM Allocation</span>
                  <span className="font-semibold text-white text-right">{results.ram}</span>
                </div>
              </div>
            </div>

            <div className="result-card col-span-1 bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-center">
              <h3 className="text-lg font-bold text-white mb-3">Pro Tips</h3>
              <ul className="text-sm text-neutral-400 space-y-2 list-disc pl-4">
                {results.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}