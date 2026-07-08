import { useState, useEffect, useRef, FormEvent } from 'react';
import { Shield, Copy, Check, Sword, Trophy, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { LeaderboardEntry, JudgementResult } from './types';

// Fictional contract address
const CONTRACT_ADDRESS = "Euh7_r2EGgXpWzN5m999_REDROGER_Crown_r2EG";

// Fictional Solana Wallets representing the top winners
const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, wallet: "DYhS..HRNj", profit: 942, share: 22.0, received: "4.8K" },
  { rank: 2, wallet: "DYBx..hdmA", profit: 815, share: 18.0, received: "3.9K" },
  { rank: 3, wallet: "4jkL..3qXi", profit: 720, share: 14.0, received: "3.1K" },
  { rank: 4, wallet: "6GWx..FzPy", profit: 540, share: 8.9, received: "1.9K" },
  { rank: 5, wallet: "Djdf..A2M9", profit: 412, share: 7.5, received: "1.6K" },
  { rank: 6, wallet: "BgXs..AQsv", profit: 310, share: 4.8, received: "1.1K" },
  { rank: 7, wallet: "Hphm..Lx1w", profit: 185, share: 3.1, received: "680" },
  { rank: 8, wallet: "Eosb..Cn35", profit: 120, share: 2.5, received: "550" },
  { rank: 9, wallet: "9duo..tUHe", profit: 95, share: 2.1, received: "460" },
  { rank: 10, wallet: "7kLq..9vPr", profit: 71, share: 1.8, received: "390" },
];

export default function App() {
  const [copiedHeader, setCopiedHeader] = useState(false);
  const [copiedFooter, setCopiedFooter] = useState(false);
  const [walletInput, setWalletInput] = useState("");
  const [judgement, setJudgement] = useState<JudgementResult | null>(null);
  const [judgingState, setJudgingState] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  
  // Timer state (5 minutes cycle)
  const [timeLeft, setTimeLeft] = useState(287); // 4 minutes 47 seconds initially (matching 00:47)
  const [rewardCycles, setRewardCycles] = useState(1442);
  const [treasuryPool, setTreasuryPool] = useState(24.85); // Maximum 30 SOL
  const [rewardedElite, setRewardedElite] = useState(142500); // 142.5K RR
  const [lastReward, setLastReward] = useState(0.25); // Smaller SOL reward
  const [flashStats, setFlashStats] = useState(false);

  const walletSectionRef = useRef<HTMLDivElement>(null);

  // Play audio synth beep
  const playSound = (freq = 200, type: OscillatorType = 'sine', duration = 0.1) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio blocked or unsupported", e);
    }
  };

  // Ticking countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          playSound(600, 'triangle', 0.5);
          setRewardCycles((c) => c + 1);
          setTreasuryPool((pool) => {
            const nextPool = pool + (Math.random() * 0.15 - 0.05);
            return parseFloat((nextPool > 29.5 ? 24.1 : nextPool).toFixed(2));
          });
          setRewardedElite((elite) => elite + Math.floor(Math.random() * 250) + 50);
          setLastReward(parseFloat((Math.random() * 0.05 + 0.01).toFixed(3)));
          
          setFlashStats(true);
          setTimeout(() => setFlashStats(false), 2000);
          
          return 300;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [soundEnabled]);

  // Periodic random fluctuation
  useEffect(() => {
    const fluctuation = setInterval(() => {
      setTreasuryPool((prev) => {
        const nextPool = prev + (Math.random() * 0.04 - 0.02);
        return parseFloat((nextPool > 29.5 ? 24.1 : nextPool).toFixed(2));
      });
    }, 4000);
    return () => clearInterval(fluctuation);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string, isHeader: boolean) => {
    navigator.clipboard.writeText(text);
    playSound(400, 'sine', 0.1);
    if (isHeader) {
      setCopiedHeader(true);
      setTimeout(() => setCopiedHeader(false), 2000);
    } else {
      setCopiedFooter(true);
      setTimeout(() => setCopiedFooter(false), 2000);
    }
  };

  const handleJudge = (e: FormEvent) => {
    e.preventDefault();
    if (!walletInput.trim()) {
      playSound(150, 'sawtooth', 0.3);
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 500);
      alert("Thou must enter thy Solana wallet, champion!");
      return;
    }

    setJudgingState(true);
    playSound(300, 'square', 0.15);
    setTimeout(() => {
      playSound(450, 'sine', 0.1);
    }, 150);

    setTimeout(() => {
      setJudgingState(false);
      const cleaned = walletInput.trim().toLowerCase();
      
      let sum = 0;
      for (let i = 0; i < cleaned.length; i++) {
        sum += cleaned.charCodeAt(i);
      }
      
      const scenario = sum % 6;
      let outcome: JudgementResult;

      if (cleaned === "dyhs..hrnj" || cleaned === "dyhs_hrnj" || cleaned.includes("hrnj")) {
        outcome = {
          title: "THE FIRST BARON OF REDROGER",
          profit: "+$942 USD",
          share: "22.0%",
          reward: "4,800 $REDROGER",
          status: "legendary",
          description: "Hail, First Baron! Thy legendary conquests on the battlefield are recorded in golden letters. The Treasury split pays thee massive tribute. The crown rests easy on thy iron brow."
        };
      } else if (cleaned.includes("redroger") || cleaned.includes("vladimir") || cleaned.includes("winner")) {
        outcome = {
          title: "GRAND ARCH-CHAMPION OF THE KINGDOM",
          profit: "+$985 USD",
          share: "28.5%",
          reward: "6,200 $REDROGER",
          status: "legendary",
          description: "By the gods! Thou art the direct kin of Red Roger himself! Thy trading blade is forged of obsidian steel. Thy victories have bankrupted complete baronies."
        };
      } else {
        switch (scenario) {
          case 0:
            outcome = {
              title: "THE TREMBLING PEASANT",
              profit: "-$250 USD",
              share: "0.0% (Ignored)",
              reward: "0 $REDROGER",
              status: "unworthy",
              description: "UNWORTHY! Thy paper hands tremble at the sight of standard volatility. Thou hast bought high, sold low, and wept in the pub. Go back to farming wheat, thy trades are a tragic comedy."
            };
            break;
          case 1:
            outcome = {
              title: "CONQUERING SWORD KNIGHT",
              profit: "+$410 USD",
              share: "2.8%",
              reward: "1,200 $REDROGER",
              status: "worthy",
              description: "Honor and steel! Thy conviction is solid, thy entries precise. Thou hast slain many bears on the field of finance. The Crown acknowledges thy steel with a barony fraction!"
            };
            break;
          case 2:
            outcome = {
              title: "THE MOCKING JESTER",
              profit: "-$540 USD",
              share: "0.0% (Ignored)",
              reward: "0 $REDROGER",
              status: "unworthy",
              description: "A financial clown! Thou hast funded the liquidations of victorious knights. The entire court laughs at thy leverage. Buy $REDROGER immediately to cure thy leverage madness, foolish jester."
            };
            break;
          case 3:
            outcome = {
              title: "THE STEADFAST BLACKSMITH",
              profit: "+$185 USD",
              share: "0.85%",
              reward: "350 $REDROGER",
              status: "worthy",
              description: "Steady and honest! Week by week, thou hammerest out solid, persistent gains. Thou art a load-bearing pillar of our economy. Receive thy reward, loyal craftsman."
            };
            break;
          case 4:
            outcome = {
              title: "ELITE CRUSADER OF REDROGER",
              profit: "+$720 USD",
              share: "11.4%",
              reward: "2,100 $REDROGER",
              status: "mighty",
              description: "A beast of conquest! Thy wallet overflows with the gold of defeated exchanges. Thou hast pillaged the trading desks and led thy comrades to absolute prosperity."
            };
            break;
          default:
            outcome = {
              title: "SOVEREIGN HIGH DUKE",
              profit: "+$850 USD",
              share: "16.5%",
              reward: "2,500 $REDROGER",
              status: "mighty",
              description: "Magnificent! A true sovereign ruler of the charts. Thy wallet is heavier than the Royal Treasury itself. The Crown rewards thy absolute merit. Long live the Duke!"
            };
        }
      }

      setJudgement(outcome);
      
      if (outcome.status === 'legendary' || outcome.status === 'mighty') {
        playSound(800, 'sine', 0.4);
        setTimeout(() => playSound(1000, 'sine', 0.2), 100);
      } else if (outcome.status === 'unworthy') {
        playSound(100, 'sawtooth', 0.4);
      } else {
        playSound(500, 'triangle', 0.2);
      }
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 400);

    }, 1200);
  };

  const handleLeaderboardRowClick = (walletStr: string, profitNum: number) => {
    setWalletInput(walletStr);
    playSound(350, 'sine', 0.1);
    
    setJudgingState(true);
    setTimeout(() => {
      setJudgingState(false);
      const found = MOCK_LEADERBOARD.find(e => e.wallet === walletStr);
      if (found) {
        setJudgement({
          title: `THE ROYAL CHAMPION OF EPOCH`,
          profit: `+$${found.profit.toLocaleString()} USD`,
          share: `${found.share}%`,
          reward: `${found.received} $REDROGER`,
          status: found.rank <= 3 ? "legendary" : "worthy",
          description: `All hail Rank #${found.rank}! This wallet (${found.wallet}) conqueror captured a whopping ${found.share}% share of the epoch's crown pool. Strength is rewarded.`
        });
      }
    }, 400);

    walletSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      setTimeout(() => {
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(440, ctx.currentTime);
          gain.gain.setValueAtTime(0.05, ctx.currentTime);
          osc.start();
          osc.stop(ctx.currentTime + 0.1);
        } catch (e) {}
      }, 100);
    }
  };

  return (
    <div className={`min-h-screen bg-[#8B0000] text-black font-serif flex flex-col items-center justify-start p-4 md:p-8 select-none transition-all duration-300 relative ${screenShake ? 'animate-bounce' : ''}`}>
      
      {/* Decorative full layout frame border */}
      <div className="w-full max-w-4xl bg-[#8B0000] p-4 md:p-8 border-[12px] border-[#240808] flex flex-col relative retro-grid shadow-2xl">
        
        {/* HEADER SECTION */}
        <header className="flex justify-between items-end border-b-2 border-[#240808] pb-4 mb-8">
          <div className="flex flex-col">
            <h1 className="text-4xl font-black tracking-tighter leading-none uppercase font-gothic" style={{ fontFamily: 'Georgia, serif' }}>
              REDROGER
            </h1>
            <span className="text-[10px] font-mono tracking-widest mt-1 opacity-80 uppercase">Est. MMXXVI &bull; Meritocracy First</span>
          </div>
          
          <div className="flex gap-4 items-center">
            {/* Audio Toggle button */}
            <button 
              onClick={toggleSound}
              className="border-2 border-[#240808] p-1.5 text-black bg-[#991111] hover:bg-[#ff2a44] cursor-pointer shadow-[2px_2px_0px_0px_rgba(36,8,8,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
              title={soundEnabled ? "Mute chimes" : "Enable chimes"}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-black/75" />}
            </button>
            
            <div className="flex flex-col items-end text-[9px] font-mono font-bold uppercase">
              <span>Network Status</span>
              <span className="text-[#00FF00] font-black drop-shadow-[0_0_5px_rgba(0,255,0,0.5)]">● VIGILANT</span>
            </div>
          </div>
        </header>

        {/* HERO SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-10">
          
          {/* Hero Left: Text & Buttons */}
          <div className="md:col-span-7 flex flex-col">
            <div className="mb-6">
              <span className="text-[9px] font-mono font-black uppercase tracking-widest text-[#240808]/75 mb-2 block">
                AN ORDER OF NOBLE PURPOSE
              </span>
              <h2 className="text-4xl md:text-5xl leading-[0.95] font-black uppercase mb-4 tracking-tighter font-gothic" style={{ fontFamily: 'Georgia, serif' }}>
                REWARDS<br/>THE STRONG.<br/>
                <span className="text-white bg-[#240808] px-2 py-0.5 inline-block my-1">EMPOWERS</span><br/>THE WINNERS.
              </h2>
              
              <p className="text-xs md:text-sm leading-relaxed max-w-md font-bold text-[#240808] border-l-4 border-[#240808] pl-4 italic my-4">
                Hold $REDROGER. Every reward cycle analyzes every holder. Those with the highest realized profits, strongest positions and greatest victories receive even larger rewards. Strength is rewarded. Weakness is ignored.
              </p>
              
              <div className="flex gap-4 mt-6">
                <a 
                  href="https://pump.fun" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => playSound(600, 'square', 0.1)}
                  className="bg-[#240808] text-[#8B0000] hover:bg-[#ff2a44] hover:text-black px-6 py-3 text-xs font-black uppercase tracking-tighter transition-colors border-2 border-[#240808] shadow-[3px_3px_0px_0px_rgba(36,8,8,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                >
                  Buy on Pumpfun
                </a>
                <button 
                  onClick={() => {
                    playSound(400, 'triangle', 0.15);
                    walletSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="border-2 border-[#240808] bg-transparent text-black px-6 py-3 text-xs font-black uppercase tracking-tighter hover:bg-[#240808] hover:text-[#8B0000] transition-colors shadow-[3px_3px_0px_0px_rgba(36,8,8,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                >
                  Check Thy Glory
                </button>
              </div>
              
              <span className="text-[9px] font-mono font-bold uppercase tracking-wide opacity-75 mt-3 block">
                no registration. no forms. victory, finally profitable.
              </span>
            </div>
          </div>

          {/* Hero Right: Mascot Poster (Pasted/glued paper poster to the wall) */}
          <div className="md:col-span-5 flex justify-center py-4">
            <div className="bg-[#ebdcb9] p-4 text-[#240808] border border-[#d4c19c] shadow-2xl rotate-[-1.5deg] hover:rotate-0 transition-transform duration-300 relative max-w-[280px] w-full flex flex-col items-center">
              
              {/* Semi-translucent masking tape strips glued to corners */}
              <div className="absolute -top-3 -left-3 w-9 h-4 bg-[#eadaad]/70 rotate-[-30deg] border border-[#dfcca0]/30 shadow-[1px_1px_2px_rgba(0,0,0,0.05)] pointer-events-none"></div>
              <div className="absolute -top-3 -right-3 w-9 h-4 bg-[#eadaad]/70 rotate-[35deg] border border-[#dfcca0]/30 shadow-[1px_1px_2px_rgba(0,0,0,0.05)] pointer-events-none"></div>
              <div className="absolute -bottom-3 -left-3 w-9 h-4 bg-[#eadaad]/70 rotate-[25deg] border border-[#dfcca0]/30 shadow-[1px_1px_2px_rgba(0,0,0,0.05)] pointer-events-none"></div>
              <div className="absolute -bottom-3 -right-3 w-9 h-4 bg-[#eadaad]/70 rotate-[-28deg] border border-[#dfcca0]/30 shadow-[1px_1px_2px_rgba(0,0,0,0.05)] pointer-events-none"></div>
              
              <h3 className="text-[#240808] text-lg font-black tracking-widest font-gothic mb-1" style={{ fontFamily: 'Georgia, serif' }}>WANTED</h3>
              <div className="h-[2px] w-full bg-[#240808]/30 my-1"></div>
              
              <div className="relative aspect-square w-full border border-[#240808]/40 overflow-hidden bg-black/5">
                <img 
                  src="https://i.postimg.cc/Nj8WsDFr/Chat-GPT-Image-8-iul-2026-g-16-05-05.png" 
                  alt="Red Roger Mascot" 
                  className="w-full h-full object-cover scale-[1.01]" 
                />
              </div>
              
              <div className="mt-2 text-center">
                <span className="text-[#240808] text-xs font-mono font-black block uppercase tracking-wider">the wolf knight</span>
                <span className="text-[#8B0000] text-[8px] font-mono uppercase font-bold block mt-0.5">last seen rewarding the strongest</span>
              </div>
              
              {/* Diagonally oriented stamp */}
              <div className="absolute top-8 -right-3 bg-[#991111] text-white border border-black px-1.5 py-0.5 rotate-12 text-[8px] font-black tracking-widest uppercase shadow-md z-30">
                REWARDED
              </div>
            </div>
          </div>

        </div>

        {/* STATISTICS STRIP SECTION */}
        <div className="border-4 border-[#240808] grid grid-cols-2 md:grid-cols-4 bg-[#991111] shadow-[4px_4px_0px_0px_rgba(36,8,8,1)] relative overflow-hidden mb-10">
          
          <div className="border-r-2 border-b-2 md:border-b-0 border-[#240808] p-4 flex flex-col items-center justify-center text-center">
            <span className="text-[9px] uppercase font-mono font-black mb-1">Treasury</span>
            <span className="text-lg font-black text-black">
              {treasuryPool.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} SOL
            </span>
          </div>
          
          <div className="border-r-0 md:border-r-2 border-b-2 md:border-b-0 border-[#240808] p-4 flex flex-col items-center justify-center text-center">
            <span className="text-[9px] uppercase font-mono font-black mb-1">Next Reward</span>
            <span className="text-lg font-black text-black flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin text-black/50" />
              {formatTime(timeLeft)}
            </span>
          </div>
          
          <div className="border-r-2 border-[#240808] p-4 flex flex-col items-center justify-center text-center">
            <span className="text-[9px] uppercase font-mono font-black mb-1">Rewarded to Elite</span>
            <span className="text-lg font-black text-black">
              {(rewardedElite / 1000).toFixed(1)}K RR
            </span>
          </div>
          
          <div className="p-4 flex flex-col items-center justify-center text-center">
            <span className="text-[9px] uppercase font-mono font-black mb-1">Last Reward</span>
            <span className="text-lg font-black text-black">
              +{lastReward.toFixed(3)} SOL
            </span>
          </div>

          {/* Continuous scrolling live ledger feed */}
          <div className="col-span-2 md:col-span-4 bg-black text-[#8B0000] text-[8px] font-mono py-1 overflow-hidden whitespace-nowrap border-t-2 border-[#240808]">
            <div className="animate-marquee inline-block">
              <span>0x8f...21a +$412 • 0x4d...90e +$942 • 0x1a...f6c +$95 • 0xbc...77d REWARDED • 0x99...221 +$720 • 0xea...001 +$310 • STRENGTH COMPLETED • THE STRONGEST WALLETS ARE REWARDED • </span>
              <span>0x8f...21a +$412 • 0x4d...90e +$942 • 0x1a...f6c +$95 • 0xbc...77d REWARDED • 0x99...221 +$720 • 0xea...001 +$310 • STRENGTH COMPLETED • THE STRONGEST WALLETS ARE REWARDED • </span>
            </div>
          </div>
        </div>

        {/* LEADERBOARD TABLE SECTION */}
        <div className="flex flex-col border-4 border-[#240808] bg-[#8B0000] shadow-[4px_4px_0px_0px_rgba(36,8,8,1)] mb-10 overflow-hidden">
          
          {/* Table Header block */}
          <div className="p-3 bg-black text-[#8B0000] flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-[#240808] font-mono gap-1">
            <span className="text-xs font-black uppercase tracking-widest text-[#fff]">THE CHAMPIONS</span>
            <span className="text-[9px] font-mono text-[#ffccd2] opacity-80">
              the greater thy triumph, the fatter thy share • 10 elite of 810 holders
            </span>
          </div>
          
          {/* Scrollable layout table */}
          <div className="max-h-[300px] overflow-y-auto">
            <table className="w-full text-left text-[11px] font-bold border-collapse">
              <thead className="border-b-2 border-[#240808] uppercase text-[9px] text-black/70 sticky top-0 bg-[#8B0000] z-10">
                <tr>
                  <th className="p-2">Rank</th>
                  <th className="p-2">Champion</th>
                  <th className="p-2 text-right">30D Profit</th>
                  <th className="p-2 text-right">Share</th>
                  <th className="p-2 text-right">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#240808] font-mono text-xs">
                {MOCK_LEADERBOARD.map((item) => (
                  <tr 
                    key={item.rank}
                    onClick={() => handleLeaderboardRowClick(item.wallet, item.profit)}
                    className="hover:bg-[#991111]/30 active:bg-[#991111]/60 cursor-pointer transition-colors"
                  >
                    <td className="p-2 text-black font-extrabold">{item.rank}</td>
                    <td className="p-2 text-black flex items-center gap-1 font-bold">
                      🛡️ {item.wallet}
                    </td>
                    <td className="p-2 text-right text-[#00FF00] font-bold">
                      +${item.profit.toLocaleString()}
                    </td>
                    <td className="p-2 text-right text-black/80">{item.share}%</td>
                    <td className="p-2 text-right text-black font-black">{item.received}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-2 border-t-2 border-[#240808] text-center text-[9px] font-black uppercase text-black/70 bg-[#991111]/25">
            The throne belongs to those who conquer.
          </div>
        </div>

        {/* WALLET CHECKER SECTION */}
        <div ref={walletSectionRef} className="col-span-12 bg-black p-5 flex flex-col justify-center border-4 border-[#240808] shadow-[4px_4px_0px_0px_rgba(36,8,8,1)] relative scroll-mt-24 mb-10">
          <span className="text-[10px] text-[#8B0000] font-black uppercase tracking-widest mb-1 font-mono">
            CHECK THY GLORY
          </span>
          <span className="text-[8px] font-mono text-white/50 mb-4 block uppercase">
            paste thy solana address. the ledger does not lie.
          </span>
          
          <form onSubmit={handleJudge} className="flex gap-2">
            <input 
              type="text" 
              value={walletInput}
              onChange={(e) => setWalletInput(e.target.value)}
              placeholder="THY SOL WALLET..." 
              className="flex-1 bg-transparent border-b border-[#8B0000] text-[#ffccd2] text-xs font-mono focus:outline-none py-1 placeholder:text-[#8B0000]/60"
            />
            <button 
              type="submit"
              disabled={judgingState}
              className="bg-[#8B0000] text-black hover:bg-[#ff2a44] hover:text-white px-5 py-2 text-[10px] font-black uppercase transition-colors whitespace-nowrap cursor-pointer border border-black"
            >
              {judgingState ? "JUDGING..." : "JUDGE ME"}
            </button>
          </form>

          {/* Display beautifully interactive certificate results feedback */}
          {judgement && (
            <div className="mt-4 border border-[#8B0000]/40 p-3 bg-[#8B0000]/15 text-[#fff] font-mono text-[10px] space-y-1.5 animate-pulse">
              <div className="flex justify-between font-black text-[#ffccd2]">
                <span className="tracking-wider">{judgement.title}</span>
                <span className="uppercase text-xs font-black underline">{judgement.status}</span>
              </div>
              <div className="text-white/80">30D PnL: <span className="font-bold text-[#00FF00]">{judgement.profit}</span></div>
              <div className="text-white/80">Est. Reward: <span className="font-bold text-[#00FF00]">{judgement.reward}</span></div>
              <p className="italic text-white/70 pt-1 leading-snug">"{judgement.description}"</p>
            </div>
          )}
        </div>

        {/* RULES / DECREE SECTION */}
        <div className="border-4 border-[#240808] bg-[#991111] p-5 md:p-6 shadow-[4px_4px_0px_0px_rgba(36,8,8,1)] mb-8">
          <h3 className="text-xl font-black uppercase tracking-widest text-[#240808] font-gothic mb-4 text-center">
            THE DECREE
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-[#240808] text-white font-mono font-black text-xs px-2 py-0.5 rounded-sm">I</div>
              <div className="text-xs font-mono font-bold leading-tight text-black">
                <span className="font-black">Buy $REDROGER.</span> Any amount. Even a copper. Only champions compete for the royal bounty.
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-[#240808] text-white font-mono font-black text-xs px-2 py-0.5 rounded-sm">II</div>
              <div className="text-xs font-mono font-bold leading-tight text-black">
                That is all. No registration. The engine sees every holder the moment the coins arrive.
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-[#240808] text-white font-mono font-black text-xs px-1.5 py-0.5 rounded-sm">III</div>
              <div className="text-xs font-mono font-bold leading-tight text-black">
                Every epoch it reads thy 30-day realized PnL straight from the chain. Thou canst not hide, and thou canst not fake it.
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-[#240808] text-white font-mono font-black text-xs px-2 py-0.5 rounded-sm">IV</div>
              <div className="text-xs font-mono font-bold leading-tight text-black">
                Trading fees are claimed <span className="font-black">every minute</span> and swapped into $REDROGER. Every 5 minutes the purse is split among the elite, strictly by the size of their victories.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-[#240808] text-white font-mono font-black text-xs px-2 py-0.5 rounded-sm">V</div>
              <div className="text-xs font-mono font-bold leading-tight text-black">
                Leaderboard of honor. The strongest grow stronger, the weak are ignored. Fortune favors those who have already conquered.
              </div>
            </div>
          </div>
          
          <div className="h-px bg-[#240808]/40 my-4"></div>
          
          <p className="text-[10px] font-mono font-bold uppercase tracking-wide text-center text-[#240808]">
            in profit &rarr; crown rewards thee, congrats. down bad &rarr; the treasury owes thee nothing. <span className="font-black text-black">your success, priced in.</span>
          </p>
        </div>

        {/* FOOTER */}
        <footer className="mt-4 pt-6 border-t-2 border-[#240808]/40 flex flex-col md:flex-row justify-between items-center opacity-85 text-[10px] font-mono font-bold uppercase tracking-[2px] gap-4">
          <div>REDROGER &bull; the crown rewards its champions</div>
          
          <button 
            onClick={() => copyToClipboard(CONTRACT_ADDRESS, false)}
            className="border-2 border-[#240808] px-3 py-1 bg-[#240808] text-white hover:bg-black hover:text-[#ff2a44] transition-colors"
          >
            {copiedFooter ? "COPIED CHAMPION ADDRESS!" : `CA: Euh7...r2EG`}
          </button>
          
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">X / Discord</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
