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

  // --- State Management (Upgraded Defaults) ---
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

  // --- GSAP Mouse Follower ---
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

  // --- THE BRAIN: DYNAMIC ENGINE v8.0 (Extreme Tier Physics) ---
  const calculateSettings = () => {
    setIsGenerating(true);
    setResults(null);

    setTimeout(() => {
      // Hardware Classification
      const lowEndGpus = ["none", "low"];
      const midTierGpus = ["mid_1", "mid_2"];
      
      let gpuScore = lowEndGpus.includes(formData.gpu) ? 1 : midTierGpus.includes(formData.gpu) ? 2 : 3;
      let calcTips: string[] = ["Pro Tip: Use a clean mousepad for best tracking consistency."];

      // 1. SMART RAM ALLOCATION (Based on GPU Score)
      let calcRam = "";
      if (formData.customRam.trim() !== "") {
        let numericRam = parseFloat(formData.customRam);
        if (!isNaN(numericRam) && numericRam > 0) {
          let allocatedMb = Math.round((numericRam * 1024) / 2); 
          calcRam = `${allocatedMb} MB (Custom Optimized)`;
          if (numericRam <= 4) calcTips.push("WARNING: Low custom RAM. Close background apps.");
        } else {
          calcRam = gpuScore === 3 ? "8192 MB (Fallback)" : "4096 MB (Fallback)";
        }
      } else {
        if (formData.ramSize === "4gb") {
          calcRam = "2048 MB (Max Allowed)";
          calcTips.push("WARNING: 4GB RAM is very low. Enable 'Memory Purge' in emulator.");
        } else if (formData.ramSize === "8gb") {
          calcRam = "4096 MB (Optimal)";
        } else if (formData.ramSize === "16gb" || formData.ramSize === "32gb") {
          calcRam = gpuScore === 3 ? "8192 MB (Maximum Performance)" : "4096 MB (Stable Limit)";
        } else if (formData.ramSize === "none") {
          // Auto-calculate if user selects 'none'
          calcRam = gpuScore === 3 ? "8192 MB (Auto-Beast)" : gpuScore === 2 ? "4096 MB (Auto-Mid)" : "2048 MB (Auto-Low)";
        }
      }

      // 2. RENDER ENGINE LOGIC (Extreme scaling)
      let calcEngine = "";
      if (gpuScore === 3) {
        calcEngine = "Vulkan / OpenGL+ (Beast Mode)";
        calcTips.push("Extreme PC: Turn on 'Enable High Frame Rates' (90/120 FPS).");
      } else if (gpuScore === 2) {
        calcEngine = "OpenGL (Best for Dedicated GPUs)";
        calcTips.push("Enable 'Prefer Dedicated GPU' in emulator settings.");
      } else {
        calcEngine = "DirectX (Smoother for Low-End)";
        calcTips.push("Lower in-game graphics to 'Smooth' to avoid frame drops.");
      }

      // 3. HYBRID RESOLUTION & DPI LOGIC
      let calcDpi = 240;
      let baseResolution = "720p";

      if (formData.customResolution.trim() !== "") {
        let resString = formData.customResolution.toLowerCase();
        if (resString.includes("1080")) baseResolution = "1080p";
        else if (resString.includes("900")) baseResolution = "900p";
        else baseResolution = "720p";
      } else {
        if (formData.resolution === "none") {
          baseResolution = gpuScore === 3 ? "1080p" : gpuScore === 2 ? "900p" : "720p";
        } else {
          baseResolution = formData.resolution;
        }
      }

      if (formData.customDpi.trim() !== "") {
        let numericDpi = parseInt(formData.customDpi);
        if (!isNaN(numericDpi) && numericDpi > 0) calcDpi = numericDpi; 
      } else {
        if (gpuScore === 3) calcDpi = 480;
        else if (gpuScore === 2) calcDpi = 320;
        else calcDpi = 240;
      }

      // 4. THE EXTREME SENSITIVITY MATH (Square Root Curve)
      let rawSensX = 1.0; 
      let rawSensY = 1.0;
      
      let baseMultiplierX = formData.game === "freefire" ? 1.4 : 0.9;
      let baseMultiplierY = formData.game === "freefire" ? 1.8 : 1.0; 

      if (formData.game === "freefire") calcTips.push("FreeFire: Keep in-game General sensitivity at 95-100.");
      
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
      <div 
        ref={cursorGlowRef} 
        className="fixed top-0 left-0 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0 hidden md:block"
      ></div>

      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-3/4 h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24 flex flex-col items-center text-center">
        
        <div className="animate-el inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Engine v8.0 Extreme Physics
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

        <div className="animate-el w-full max-w-5xl bg-neutral-900/40 backdrop-blur-2xl border border-neutral-800 rounded-3xl p-8 shadow-2xl relative mb-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left mb-10">
            
            <div className="animate-card-el space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Processor (CPU)</label>
              <select name="cpu" value={formData.cpu} onChange={handleInputChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3.5 text-neutral-200 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer">
                <option value="core2duo">Intel Core 2 Duo / Dual Core</option>
                <option value="i3_low">Intel i3 (1st - 3rd Gen) / AMD A-Series</option>
                <option value="i5_mid">Intel i5 (2nd - 4th Gen) / Ryzen 3</option>
                <option value="i7_mid">Intel i7 (3rd - 4th Gen) / Ryzen 5 (Early)</option>
                <option value="i5_high">Intel i5/i7 (8th - 10th Gen) / Ryzen 3000s</option>
                <option value="i7_ultra">Intel i7/i9 (11th Gen+) / Ryzen 5000+</option>
                <option value="extreme">Beast PC (Intel 13th/14th Gen / Ryzen 7000+)</option>
              </select>
            </div>

            <div className="animate-card-el space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Graphic Card (GPU)</label>
              <select name="gpu" value={formData.gpu} onChange={handleInputChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3.5 text-neutral-200 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer">
                <option value="none">Intel HD Graphics / APU (No GPU)</option>
                <option value="low">NVIDIA GT 710 / 730 / 1030</option>
                <option value="mid_1">GTX 750 Ti / GTX 1050 Ti / RX 560</option>
                <option value="mid_2">GTX 1650 / 1660 / RX 570 / RX 580</option>
                <option value="high">RTX 2060 / 3060 / RX 6600</option>
                <option value="ultra">RTX 4060 / 4070 / RX 7800</option>
                <option value="extreme">RTX 4090 / RX 7900 XTX (Monster Level)</option>
              </select>
            </div>

            <div className="animate-card-el space-y-2">
              <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Total PC RAM (Presets)</label>
              <select name="ramSize" value={formData.ramSize} onChange={handleInputChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3.5 text-neutral-200 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer">
                <option value="none">None (Auto Calculate)</option>
                <option value="4gb">4 GB RAM (Low)</option>
                <option value="8gb">8 GB RAM (Standard)</option>
                <option value="16gb">16 GB RAM (Good)</option>
                <option value="32gb">32 GB+ RAM (Beast)</option>
              </select>
            </div>

            <div className="animate-card-el space-y-2">
              <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Screen Resolution</label>
              <select name="resolution" value={formData.resolution} onChange={handleInputChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3.5 text-neutral-200 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer">
                <option value="none">None (Auto Calculate)</option>
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
                  Calculating v8.0 Physics...
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