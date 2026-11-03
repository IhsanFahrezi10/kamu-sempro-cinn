"use client";

export default function SideDecorations() {
  return (
    <div aria-hidden className="fixed inset-0 pointer-events-none z-[2] overflow-hidden hidden md:block">
      <div className="absolute left-0 top-0 sway-slow">
        <Branch />
      </div>
      <div className="absolute right-0 top-0" style={{ transform: "scaleX(-1)" }}>
        <div className="sway-slow-alt">
          <Branch />
        </div>
      </div>
      <div className="absolute left-0 bottom-0 sway-slow-alt hidden lg:block" style={{ transform: "rotate(180deg)", transformOrigin: "bottom left" }}>
        <SmallBranch />
      </div>
      <div className="absolute right-0 bottom-0 hidden lg:block" style={{ transform: "scaleX(-1) rotate(180deg)" }}>
        <div className="sway-slow">
          <SmallBranch />
        </div>
      </div>
    </div>
  );
}

function Branch() {
  return (
    <svg width="240" height="760" viewBox="0 0 240 760" fill="none" className="opacity-70">
      <path d="M-10 30 Q 70 200, 55 400 Q 45 560, 110 720" stroke="#7A2E45" strokeWidth="3.5" strokeLinecap="round" opacity="0.32" />
      <path d="M30 110 Q 100 130, 165 100" stroke="#7A2E45" strokeWidth="2" strokeLinecap="round" opacity="0.28" />
      <path d="M40 290 Q 120 310, 195 265" stroke="#7A2E45" strokeWidth="2" strokeLinecap="round" opacity="0.28" />
      <path d="M35 490 Q 90 510, 145 480" stroke="#7A2E45" strokeWidth="1.8" strokeLinecap="round" opacity="0.25" />
      <ellipse cx="175" cy="95" rx="28" ry="9" fill="#8FA88F" opacity="0.42" transform="rotate(-12 175 95)" />
      <ellipse cx="200" cy="260" rx="26" ry="8" fill="#8FA88F" opacity="0.42" transform="rotate(15 200 260)" />
      <ellipse cx="155" cy="480" rx="22" ry="7" fill="#8FA88F" opacity="0.4" transform="rotate(-22 155 480)" />
      <ellipse cx="70" cy="200" rx="20" ry="6" fill="#8FA88F" opacity="0.35" transform="rotate(-40 70 200)" />
      <ellipse cx="90" cy="600" rx="20" ry="6" fill="#8FA88F" opacity="0.35" transform="rotate(-30 90 600)" />
      <Sakura cx={165} cy={105} r={22} />
      <Sakura cx={195} cy={268} r={20} />
      <Sakura cx={150} cy={488} r={18} />
      <Sakura cx={70} cy={185} r={16} />
      <Sakura cx={115} cy={720} r={24} />
      <circle cx="120" cy="215" r="3.5" fill="#FF8FAB" opacity="0.75" />
      <circle cx="170" cy="345" r="3" fill="#FF8FAB" opacity="0.7" />
      <circle cx="55" cy="360" r="3" fill="#FF8FAB" opacity="0.7" />
      <circle cx="130" cy="580" r="3" fill="#FF8FAB" opacity="0.7" />
      <circle cx="60" cy="650" r="2.5" fill="#FF8FAB" opacity="0.65" />
    </svg>
  );
}

function SmallBranch() {
  return (
    <svg width="160" height="360" viewBox="0 0 160 360" fill="none" className="opacity-55">
      <path d="M-5 20 Q 60 120, 40 240 Q 30 320, 85 350" stroke="#7A2E45" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
      <path d="M25 120 Q 90 140, 130 100" stroke="#7A2E45" strokeWidth="1.5" strokeLinecap="round" opacity="0.28" />
      <ellipse cx="130" cy="95" rx="20" ry="6" fill="#8FA88F" opacity="0.4" transform="rotate(-15 130 95)" />
      <Sakura cx={125} cy={110} r={16} />
      <Sakura cx={50} cy={230} r={14} />
      <Sakura cx={85} cy={345} r={18} />
      <circle cx="95" cy="175" r="2.5" fill="#FF8FAB" opacity="0.7" />
      <circle cx="35" cy="300" r="2" fill="#FF8FAB" opacity="0.7" />
    </svg>
  );
}

function Sakura({ cx, cy, r = 20 }: { cx: number; cy: number; r?: number }) {
  const round2 = (n: number) => Math.round(n * 100) / 100;
  const petals = [0, 72, 144, 216, 288];
  return (
    <g>
      {petals.map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const px = round2(cx + Math.cos(rad) * (r * 0.52));
        const py = round2(cy + Math.sin(rad) * (r * 0.52));
        const rx = round2(r * 0.42);
        const ry = round2(r * 0.65);
        const rot = round2(angle + 90);
        return <ellipse key={angle} cx={px} cy={py} rx={rx} ry={ry} fill="#FFC1D5" opacity="0.92" transform={`rotate(${rot} ${px} ${py})`} />;
      })}
      <circle cx={cx} cy={cy} r={round2(r * 0.24)} fill="#F0C979" />
      <circle cx={cx} cy={cy} r={round2(r * 0.12)} fill="#C73E68" opacity="0.6" />
    </g>
  );
}
