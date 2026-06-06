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

  // --- State Management ---
  const [formData, setFormData] = useState<FormData>({
    cpu: "i5_mid",
    gpu: "mid_1",
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

  // --- GSAP Mouse Follower (Premium Glow) ---
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

  // --- GSAP Initial Page Load Animations ---
  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo(".animate-el", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power4.out", delay: 0.2 });
  }, { scope: containerRef });

  // --- GSAP Popup Results Animation (The Awwwards Bounce) ---
  useGSAP(() => {
    if (results) {
      gsap.fromTo(
        ".result-overlay", 
        { scale: 0.7, opacity: 0, y: 20 }, 
        { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: "elastic.out(1, 0.6)" }
      );
    }
  }, { dependencies: [results], scope: containerRef });

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- THE BRAIN: DYNAMIC ENGINE v8.0 ---
  const calculateSettings = () => {
    setIsGenerating(true);
    setResults(null);

    setTimeout(() => {
      const lowEndGpus = ["none", "low"];
      const midTierGpus = ["mid_1", "mid_2"];
      
      let gpuScore = lowEndGpus.includes(formData.gpu) ? 1 : midTierGpus.includes(formData.gpu) ? 2 : 3;
      let calcTips: string[] = ["Pro Tip: Use a clean mousepad for best tracking consistency."];

      // RAM Allocation
      let calcRam = "";
      if (formData.customRam.trim() !== "") {
        let numericRam = parseFloat(formData.customRam);
        if (!isNaN(numericRam) && numericRam > 0) {
          let allocatedMb = Math.round((numericRam * 1024) / 2); 
          calcRam = `${allocatedMb} MB (Custom)`;
          if (numericRam <= 4) calcTips.push("WARNING: Low custom RAM. Close background apps.");
        } else calcRam = gpuScore === 3 ? "8192 MB (Fallback)" : "4096 MB (Fallback)";
      } else {
        if (formData.ramSize === "4gb") {
          calcRam = "2048 MB (Max Allowed)";
          calcTips.push("WARNING: 4GB RAM is very low. Enable 'Memory Purge'.");
        } else if (formData.ramSize === "8gb") calcRam = "4096 MB (Optimal)";
        else if (formData.ramSize === "16gb" || formData.ramSize === "32gb") calcRam = gpuScore === 3 ? "8192 MB (Maximum)" : "4096 MB (Stable)";
        else calcRam = gpuScore === 3 ? "8192 MB (Auto-Beast)" : gpuScore === 2 ? "4096 MB (Auto-Mid)" : "2048 MB (Auto-Low)";
      }

      // Render Engine
      let calcEngine = "";
      if (gpuScore === 3) {
        calcEngine = "Vulkan / OpenGL+ (Beast)";
        calcTips.push("Extreme PC: Turn on 'Enable High Frame Rates'.");
      } else if (gpuScore === 2) {
        calcEngine = "OpenGL (Dedicated)";
        calcTips.push("Enable 'Prefer Dedicated GPU' in emulator settings.");
      } else {
        calcEngine = "DirectX (Smooth)";
        calcTips.push("Lower in-game graphics to 'Smooth' to avoid frame drops.");
      }

      // Resolution & DPI
      let calcDpi = 240;
      let baseResolution = "720p";

      if (formData.customResolution.trim() !== "") {
        let resString = formData.customResolution.toLowerCase();
        if (resString.includes("1080")) baseResolution = "1080p";
        else if (resString.includes("900")) baseResolution = "900p";
      } else {
        if (formData.resolution === "none") baseResolution = gpuScore === 3 ? "1080p" : gpuScore === 2 ? "900p" : "720p";
        else baseResolution = formData.resolution;
      }

      if (formData.customDpi.trim() !== "") {
        let numericDpi = parseInt(formData.customDpi);
        if (!isNaN(numericDpi) && numericDpi > 0) calcDpi = numericDpi; 
      } else {
        calcDpi = gpuScore === 3 ? 480 : gpuScore === 2 ? 320 : 240;
      }

      // --- NEW DYNAMIC GAME SENSITIVITY MATH ---
      let baseMultiplierX = 1.0;
      let baseMultiplierY = 1.0;

      if (formData.game === "freefire") {
        // High Y-axis for drag headshots
        baseMultiplierX = 1.4;
        baseMultiplierY = 1.8; 
        calcTips.push("FreeFire: Keep in-game General sensitivity at 95-100 for drag headshots.");
      } else if (formData.game === "bgmi") {
        // Lower overall sensitivity, close to 1:1 ratio for recoil stability
        baseMultiplierX = 0.55;
        baseMultiplierY = 0.65;
        calcTips.push("BGMI/PUBG: Turn off 'Enhance pointer precision' in Windows for stable recoil.");
      } else if (formData.game === "codm") {
        // Snappy movement, balanced axes
        baseMultiplierX = 0.85;
        baseMultiplierY = 0.90;
        calcTips.push("CODM: Use 'Fixed Speed' sensitivity in-game to match these exact emulator values.");
      }
      
      let dpiScaleFactor = Math.sqrt(240 / calcDpi); 
      let rawSensX = Math.max(baseMultiplierX * dpiScaleFactor, 0.1);
      let rawSensY = Math.max(baseMultiplierY * dpiScaleFactor, 0.1);

      let formattedX = "";
      let formattedY = "";

      if (formData.emulator === "bluestacks") {
        formattedX = rawSensX.toFixed(2); 
        formattedY = rawSensY.toFixed(2); 
        calcTips.push("BlueStacks: Use tweak '16450' or '21058' for stable aim.");
      } else if (formData.emulator === "memu") {
        formattedX = Math.min(Math.max(Math.round(rawSensX * 36), 10), 90) + "%";
        formattedY = Math.min(Math.max(Math.round(rawSensY * 36), 10), 95) + "%";
        calcTips.push("MEmu: Drag the keymapping sliders exactly to these percentages.");
      } else if (formData.emulator === "smartgaga") {
        formattedX = (rawSensX * 2.0).toFixed(1); 
        formattedY = (rawSensY * 2.0).toFixed(1);
        calcTips.push("SmartGaga: Keep mouse polling rate at 500Hz max.");
      }

      setResults({ dpi: calcDpi, sensitivityX: formattedX, sensitivityY: formattedY, ram: calcRam, engine: calcEngine, tips: calcTips });
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <main ref={containerRef} className="min-h-screen bg-neutral-950 text-white selection:bg-emerald-500 selection:text-neutral-900 relative overflow-x-hidden flex flex-col items-center justify-center pb-20">
      
      {/* Background Grid & Glow (Awwwards Style) */}
      <div ref={cursorGlowRef} className="fixed top-0 left-0 w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-[150px] pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0 hidden md:block"></div>
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>
      
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-16 flex flex-col items-center">
        
        {/* Top Badges */}
        <div className="animate-el flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900/60 border border-neutral-800 backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
            <span className="text-white text-xs font-bold tracking-widest uppercase">Low-PC-Optimizer</span>
          </div>
          <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md text-emerald-400 text-xs font-bold tracking-widest uppercase">
            v8.0 Extreme Physics
          </div>
        </div>

        {/* Hero Title */}
        <h1 className="animate-el text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-center leading-tight mb-12">
          ULTIMATE EMULATOR <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            SENSITIVITY CALCULATOR
          </span>
        </h1>

        {/* The Glassmorphism Form Container */}
        <div className={`animate-el w-full max-w-5xl bg-neutral-900/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 md:p-12 shadow-2xl relative transition-all duration-700 ${results ? 'ring-1 ring-emerald-500/30' : ''}`}>
          
          {/* Form Grid - Blurs out when results appear */}
          <div className={`transition-all duration-700 ${results ? 'opacity-10 blur-md pointer-events-none' : 'opacity-100'}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-8">
              
              {/* Row 1: Hardware Core */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Step 1: Processor</label>
                <select name="cpu" value={formData.cpu} onChange={handleInputChange} className="w-full bg-neutral-950/60 border border-neutral-800 rounded-xl px-4 py-3.5 text-neutral-300 focus:border-emerald-500/50 outline-none appearance-none cursor-pointer transition-colors hover:bg-neutral-900/80">
                  <option value="core2duo">Intel Core 2 Duo / Dual Core</option>
                  <option value="i3_low">Intel i3 (1st - 3rd Gen) / AMD A-Series</option>
                  <option value="i5_mid">Intel i5 (2nd - 4th Gen) / Ryzen 3</option>
                  <option value="i7_mid">Intel i7 (3rd - 4th Gen) / Ryzen 5 (Early)</option>
                  <option value="i5_high">Intel i5/i7 (8th - 10th Gen) / Ryzen 3000s</option>
                  <option value="i7_ultra">Intel i7/i9 (11th Gen+) / Ryzen 5000+</option>
                  <option value="extreme">Beast PC (13th/14th Gen / Ryzen 7000+)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Step 2: Graphics</label>
                <select name="gpu" value={formData.gpu} onChange={handleInputChange} className="w-full bg-neutral-950/60 border border-neutral-800 rounded-xl px-4 py-3.5 text-neutral-300 focus:border-emerald-500/50 outline-none appearance-none cursor-pointer transition-colors hover:bg-neutral-900/80">
                  <option value="none">Intel HD Graphics (No GPU)</option>
                  <option value="low">NVIDIA GT 710 / 730 / 1030</option>
                  <option value="mid_1">GTX 750 Ti / 1050 Ti / RX 560</option>
                  <option value="mid_2">GTX 1650 / 1660 / RX 570 / 580</option>
                  <option value="high">RTX 2060 / 3060 / RX 6600</option>
                  <option value="ultra">RTX 4060 / 4070 / RX 7800</option>
                  <option value="extreme">RTX 4090 / RX 7900 XTX</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Step 3: Total RAM</label>
                <select name="ramSize" value={formData.ramSize} onChange={handleInputChange} className="w-full bg-neutral-950/60 border border-neutral-800 rounded-xl px-4 py-3.5 text-neutral-300 focus:border-emerald-500/50 outline-none appearance-none cursor-pointer transition-colors hover:bg-neutral-900/80">
                  <option value="none">Auto Calculate</option>
                  <option value="4gb">4 GB RAM</option>
                  <option value="8gb">8 GB RAM</option>
                  <option value="16gb">16 GB RAM</option>
                  <option value="32gb">32 GB+ RAM</option>
                </select>
              </div>

              {/* Row 2: Environment */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Step 4: Resolution</label>
                <select name="resolution" value={formData.resolution} onChange={handleInputChange} className="w-full bg-neutral-950/60 border border-neutral-800 rounded-xl px-4 py-3.5 text-neutral-300 focus:border-cyan-500/50 outline-none appearance-none cursor-pointer transition-colors hover:bg-neutral-900/80">
                  <option value="none">Auto Calculate</option>
                  <option value="720p">720p (1280x720) - Fast</option>
                  <option value="900p">900p (1600x900) - Balanced</option>
                  <option value="1080p">1080p (1920x1080) - HD</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Step 5: Emulator</label>
                <select name="emulator" value={formData.emulator} onChange={handleInputChange} className="w-full bg-neutral-950/60 border border-neutral-800 rounded-xl px-4 py-3.5 text-neutral-300 focus:border-cyan-500/50 outline-none appearance-none cursor-pointer transition-colors hover:bg-neutral-900/80">
                  <option value="memu">MEmu Player</option>
                  <option value="bluestacks">BlueStacks 5</option>
                  <option value="smartgaga">SmartGaga</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Step 6: Game</label>
                <select name="game" value={formData.game} onChange={handleInputChange} className="w-full bg-neutral-950/60 border border-neutral-800 rounded-xl px-4 py-3.5 text-neutral-300 focus:border-cyan-500/50 outline-none appearance-none cursor-pointer transition-colors hover:bg-neutral-900/80">
                  <option value="freefire">Free Fire</option>
                  <option value="bgmi">BGMI / PUBG</option>
                  <option value="codm">Call of Duty Mobile</option>
                </select>
              </div>

              {/* Row 3: Custom Overrides */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Custom Override: RAM</label>
                <input type="text" name="customRam" value={formData.customRam} onChange={handleInputChange} placeholder="e.g. 12" className="w-full bg-neutral-950/40 border border-neutral-800 rounded-xl px-4 py-3.5 text-neutral-300 focus:border-neutral-500 outline-none placeholder-neutral-700 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Custom Override: DPI</label>
                <input type="text" name="customDpi" value={formData.customDpi} onChange={handleInputChange} placeholder="e.g. 800" className="w-full bg-neutral-950/40 border border-neutral-800 rounded-xl px-4 py-3.5 text-neutral-300 focus:border-neutral-500 outline-none placeholder-neutral-700 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Custom Override: Res</label>
                <input type="text" name="customResolution" value={formData.customResolution} onChange={handleInputChange} placeholder="e.g. 1280x720" className="w-full bg-neutral-950/40 border border-neutral-800 rounded-xl px-4 py-3.5 text-neutral-300 focus:border-neutral-500 outline-none placeholder-neutral-700 transition-colors" />
              </div>
            </div>

            {/* Generate Button Area */}
            <div className="mt-12 flex flex-col items-center">
              <button 
                onClick={calculateSettings}
                disabled={isGenerating}
                className="group relative w-full md:w-auto bg-emerald-500 text-neutral-950 font-black text-lg px-16 py-4 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.6)] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span className="relative flex items-center justify-center gap-3">
                  {isGenerating ? (
                    <>
                      <span className="w-5 h-5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin"></span>
                      CALCULATING...
                    </>
                  ) : "GENERATE PRO SETTINGS"}
                </span>
              </button>
              <p className="mt-4 text-neutral-500 text-xs font-bold uppercase tracking-widest">
                Compatible: Free Fire, PUBG Mobile, CODM
              </p>
            </div>
          </div>

          {/* THE MAGICAL RESULTS POPUP OVERLAY */}
          {results && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
              <div className="result-overlay w-full max-w-md bg-neutral-950/90 border border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.2)] rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden flex flex-col">
                
                {/* Neon Header Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
                
                <h3 className="text-emerald-400 text-center font-bold tracking-[0.2em] text-xs mb-8 uppercase">Optimized Results</h3>
                
                {/* Main Sensitivities */}
                <div className="flex flex-col gap-6 text-center mb-8">
                  <div className="text-2xl md:text-3xl font-black text-white tracking-wide">
                    X SENSITIVITY: <span className="text-emerald-400 ml-2 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">{results.sensitivityX}</span>
                  </div>
                  <div className="text-2xl md:text-3xl font-black text-white tracking-wide">
                    Y SENSITIVITY: <span className="text-emerald-400 ml-2 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">{results.sensitivityY}</span>
                  </div>
                </div>

                {/* Sub Specs */}
                <div className="grid grid-cols-2 gap-4 border-t border-neutral-800 pt-6 mb-8 text-left">
                  <div className="bg-neutral-900/50 rounded-xl p-3 border border-neutral-800">
                    <div className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider mb-1">Target DPI</div>
                    <div className="text-white text-sm font-bold">{results.dpi}</div>
                  </div>
                  <div className="bg-neutral-900/50 rounded-xl p-3 border border-neutral-800">
                    <div className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider mb-1">RAM Alloc.</div>
                    <div className="text-white text-sm font-bold truncate">{results.ram}</div>
                  </div>
                  <div className="col-span-2 bg-neutral-900/50 rounded-xl p-3 border border-neutral-800">
                    <div className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider mb-1">Render Engine</div>
                    <div className="text-cyan-400 text-sm font-bold">{results.engine}</div>
                  </div>
                </div>

                {/* Tips */}
                {results.tips.length > 0 && (
                  <div className="mb-8">
                    <div className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider mb-2">Pro Tips</div>
                    <ul className="text-xs text-neutral-300 space-y-1.5 list-disc pl-4">
                      {results.tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <button 
                  onClick={() => setResults(null)}
                  className="mt-auto w-full bg-transparent border-2 border-neutral-800 hover:border-emerald-500/50 text-neutral-300 hover:text-emerald-400 text-sm font-bold py-3 rounded-xl transition-colors duration-300 uppercase tracking-widest"
                >
                  Close & Recalculate
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}