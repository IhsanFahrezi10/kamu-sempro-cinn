"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EditorialSection from "./EditorialSection";

type Status = "idle" | "requesting" | "ready" | "capturing" | "captured" | "error";

export default function PhotoBooth() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    setStatus("requesting");
    setErrorMsg("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setStatus("ready");
    } catch (err: any) {
      const name = err?.name || "";
      if (name === "NotAllowedError") setErrorMsg("Izin kamera ditolak. Buka setting browser → izinkan kamera untuk situs ini.");
      else if (name === "NotFoundError") setErrorMsg("Kamera nggak ditemukan. Pastiin perangkat punya kamera.");
      else if (name === "NotReadableError") setErrorMsg("Kamera lagi dipake aplikasi lain. Tutup dulu Zoom/Meet/etc.");
      else setErrorMsg("Kamera gagal kebuka. Coba lagi ya.");
      setStatus("error");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const size = 900;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const vw = video.videoWidth || 640;
    const vh = video.videoHeight || 480;
    const minDim = Math.min(vw, vh);
    const sx = (vw - minDim) / 2;
    const sy = (vh - minDim) / 2;

    ctx.drawImage(video, sx, sy, minDim, minDim, 0, 0, size, size);
    return canvas.toDataURL("image/jpeg", 0.9);
  };

  const takePhotos = async () => {
    if (!streamRef.current) return;
    setPhotos([]);
    setStatus("capturing");
    const shots: string[] = [];

    for (let i = 0; i < 3; i++) {
      for (let c = 3; c > 0; c--) {
        setCountdown(c);
        await new Promise((r) => setTimeout(r, 700));
      }
      setCountdown(null);
      setFlash(true);
      await new Promise((r) => setTimeout(r, 120));
      const photo = capturePhoto();
      setFlash(false);
      if (photo) {
        shots.push(photo);
        setPhotos([...shots]);
      }
      await new Promise((r) => setTimeout(r, 500));
    }

    stopCamera();
    setStatus("captured");
  };

  const loadImage = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const drawCover = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, dx: number, dy: number, dw: number, dh: number) => {
    const imgAspect = img.width / img.height;
    const targetAspect = dw / dh;
    let sx = 0,
      sy = 0,
      sw = img.width,
      sh = img.height;

    if (imgAspect > targetAspect) {
      sh = img.height;
      sw = sh * targetAspect;
      sx = (img.width - sw) / 2;
    } else {
      sw = img.width;
      sh = sw / targetAspect;
      sy = (img.height - sh) / 2;
    }
    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
  };

  const downloadStrip = async () => {
    if (photos.length !== 3) return;
    try {
      const imgs = await Promise.all(photos.map(loadImage));

      const W = 1080;
      const H = 1920;
      const PAD_TOP = 40;
      const PAD_SIDE = 80;
      const CARD_W = W - PAD_SIDE * 2; // 920
      const CARD_H = 560;
      const CARD_X = PAD_SIDE;
      const GAP = 10;
      const PHOTO_PAD = 16;
      const PHOTO_W = CARD_W - PHOTO_PAD * 2; // 888
      const PHOTO_H = CARD_H - PHOTO_PAD * 2; // 528

      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Background gradient
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#FFF9F3");
      bg.addColorStop(1, "#FFE5EC");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Outer borders
      const border = ctx.createLinearGradient(0, 0, W, H);
      border.addColorStop(0, "#FF8FAB");
      border.addColorStop(0.5, "#C73E68");
      border.addColorStop(1, "#E0C9F0");
      ctx.strokeStyle = border;
      ctx.lineWidth = 10;
      ctx.strokeRect(5, 5, W - 10, H - 10);

      ctx.strokeStyle = "#F0C979";
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, W - 40, H - 40);

      // Corner emojis
      ctx.font = "32px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🌸", 42, 42);
      ctx.fillText("✨", W - 42, 42);
      ctx.fillText("💖", 42, H - 42);
      ctx.fillText("🌷", W - 42, H - 42);

      // 3 polaroids stacked — more square, tighter gaps
      for (let i = 0; i < 3; i++) {
        const cy = PAD_TOP + i * (CARD_H + GAP);

        // Shadow
        ctx.fillStyle = "rgba(74, 46, 58, 0.12)";
        ctx.fillRect(CARD_X + 3, cy + 3, CARD_W, CARD_H);

        // Card cream
        ctx.fillStyle = "#FFF9F3";
        ctx.fillRect(CARD_X, cy, CARD_W, CARD_H);

        // Photo
        drawCover(ctx, imgs[i], CARD_X + PHOTO_PAD, cy + PHOTO_PAD, PHOTO_W, PHOTO_H);

        // Photo border
        ctx.strokeStyle = "#4A2E3A";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(CARD_X + PHOTO_PAD, cy + PHOTO_PAD, PHOTO_W, PHOTO_H);
      }

      // Compact signature section
      const lastCardEnd = PAD_TOP + 3 * CARD_H + 2 * GAP; // 40 + 1680 + 20 = 1740
      const sigY = lastCardEnd + 55;

      ctx.fillStyle = "#C73E68";
      ctx.font = "italic 30px Georgia, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("hi there, im just finished my cemploo", W / 2, sigY);

      ctx.fillStyle = "#FF8FAB";
      ctx.font = "italic 24px Georgia, serif";
      ctx.fillText("-cinti-", W / 2, sigY + 42);

      // Tiny dots
      ctx.fillStyle = "#FFC1D5";
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(W / 2 - 40 + i * 20, sigY + 80, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `cinn-photobooth-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }, "image/png");
    } catch {
      console.error("Gagal render strip");
    }
  };

  const reset = () => {
    stopCamera();
    setPhotos([]);
    setCountdown(null);
    setStatus("idle");
    setErrorMsg("");
  };

  return (
    <EditorialSection
      number="08"
      sideLabel="Chapter Eight — Photobooth"
      title={
        <>
          Photo <em className="italic">booth.</em>
        </>
      }
      subtitle="Aktifin kamera, ambil 3 foto, langsung jadi strip 9:16"
      meta={
        <div className="hidden md:flex flex-col items-end gap-1">
          <span className="stamp">Selfie ✿</span>
          <span className="font-caveat text-xs text-ink/40 mt-2 tabular-nums">{photos.length}/3</span>
        </div>
      }
    >
      <canvas ref={canvasRef} className="hidden" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-start">
        {/* LEFT: KAMERA */}
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="md:col-span-7 w-full">
          <div className="relative max-w-[500px] mx-auto md:max-w-full">
            <div className="absolute inset-0 rounded-md rotate-1 translate-x-1 translate-y-1 bg-gradient-to-br from-rose via-pink to-lavender" />

            <div className="relative paper rounded-md p-2 shadow-2xl border-2 border-gold/60 sm:p-2.5">
              <div className="absolute inset-1 rounded-sm border-2 border-rose/40 pointer-events-none z-10" />

              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 sm:w-24 h-4 sm:h-5 bg-gold/70 rounded-sm rotate-[-3deg] shadow-md z-20" />

              <div className="relative aspect-square rounded-sm overflow-hidden bg-ink">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    opacity: status === "ready" || status === "capturing" ? 1 : 0,
                  }}
                />

                {status === "idle" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 sm:gap-4 text-center px-4 sm:px-6 z-10">
                    <span className="text-5xl sm:text-7xl opacity-40">📷</span>
                    <p className="font-caveat text-lg sm:text-2xl text-cream/90">kamera belum aktif</p>
                    <p className="font-caveat text-xs sm:text-sm text-cream/50 max-w-[260px] sm:max-w-xs">Klik tombol di bawah buat mulai.</p>
                  </div>
                )}

                {status === "requesting" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-cream/30 border-t-cream rounded-full" />
                    <p className="font-caveat text-base sm:text-lg text-cream/70">buka kamera...</p>
                  </div>
                )}

                <AnimatePresence>
                  {countdown !== null && (
                    <motion.div
                      key={countdown}
                      initial={{ opacity: 0, scale: 2 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 flex items-center justify-center bg-ink/40 pointer-events-none z-20"
                    >
                      <span className="font-pacifico text-[110px] sm:text-[160px] md:text-[220px] text-cream drop-shadow-2xl leading-none">{countdown}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {flash && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }} className="absolute inset-0 bg-white z-30 pointer-events-none" />}
                </AnimatePresence>

                {(status === "ready" || status === "capturing") && (
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-ink/70 backdrop-blur px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-cream font-caveat text-xs sm:text-sm z-20">
                    foto {Math.min(photos.length + (countdown !== null ? 1 : 0), 3)}/3
                  </div>
                )}

                {status === "captured" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 sm:gap-3 bg-cream z-10 px-4">
                    <span className="text-5xl sm:text-6xl">🎉</span>
                    <p className="font-caveat text-xl sm:text-2xl text-deep-rose">3 foto berhasil!</p>
                    <p className="font-caveat text-xs sm:text-sm text-ink/50 text-center">download strip di bawah</p>
                  </div>
                )}

                {status === "error" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-4 z-10">
                    <span className="text-5xl sm:text-6xl">😿</span>
                    <p className="font-caveat text-base sm:text-lg text-cream/90 max-w-[260px]">{errorMsg}</p>
                  </div>
                )}
              </div>

              <div className="relative mt-1.5 sm:mt-2 rounded-sm bg-gradient-to-r from-pink via-rose to-pink px-3 sm:px-4 py-2 sm:py-2.5 text-center">
                <p className="font-caveat text-xs sm:text-sm md:text-base text-cream italic">hi there, im just finished my cemploo</p>
              </div>
            </div>

            <span className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 text-2xl sm:text-3xl rotate-[-15deg] select-none drop-shadow-md z-30">🌸</span>
            <span className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 text-2xl sm:text-3xl rotate-[15deg] select-none drop-shadow-md z-30">✨</span>
            <span className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 text-2xl sm:text-3xl rotate-[10deg] select-none drop-shadow-md z-30">💖</span>
            <span className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 text-2xl sm:text-3xl rotate-[-10deg] select-none drop-shadow-md z-30">🌷</span>
          </div>

          <div className="mt-4 sm:mt-5 flex flex-col gap-2 max-w-[500px] mx-auto md:max-w-full">
            {status === "idle" && (
              <button
                onClick={startCamera}
                className="w-full bg-deep-rose text-cream py-4 sm:py-3.5 rounded-full font-semibold text-sm sm:text-xs tracking-widest uppercase hover:bg-rose transition shadow-lg active:scale-[0.98] touch-manipulation"
              >
                📷 Aktifin Kamera
              </button>
            )}
            {status === "requesting" && (
              <button disabled className="w-full bg-ink/20 text-ink/40 py-4 sm:py-3.5 rounded-full font-semibold text-sm sm:text-xs tracking-widest uppercase cursor-wait">
                Loading...
              </button>
            )}
            {status === "ready" && (
              <button
                onClick={takePhotos}
                className="w-full bg-deep-rose text-cream py-4 sm:py-3.5 rounded-full font-semibold text-sm sm:text-xs tracking-widest uppercase hover:bg-rose transition shadow-lg active:scale-[0.98] touch-manipulation"
              >
                ✨ Mulai Foto (3x)
              </button>
            )}
            {status === "capturing" && (
              <button disabled className="w-full bg-ink/20 text-ink/40 py-4 sm:py-3.5 rounded-full font-semibold text-sm sm:text-xs tracking-widest uppercase cursor-wait">
                Jangan gerak... ({photos.length}/3)
              </button>
            )}
            {status === "captured" && (
              <>
                <button
                  onClick={downloadStrip}
                  className="w-full bg-sage text-cream py-4 sm:py-3.5 rounded-full font-semibold text-sm sm:text-xs tracking-widest uppercase hover:brightness-110 transition shadow-lg active:scale-[0.98] touch-manipulation"
                >
                  ⬇ Download Strip (9:16)
                </button>
                <button onClick={reset} className="w-full py-3 sm:py-3.5 rounded-full border-2 border-ink/20 text-ink/60 font-semibold text-sm sm:text-xs tracking-widest uppercase hover:border-ink/40 transition active:scale-[0.98]">
                  Reset
                </button>
              </>
            )}
            {status === "error" && (
              <>
                <button onClick={startCamera} className="w-full bg-deep-rose text-cream py-4 sm:py-3.5 rounded-full font-semibold text-sm sm:text-xs tracking-widest uppercase hover:bg-rose transition shadow-lg active:scale-[0.98]">
                  🔄 Coba Lagi
                </button>
                <button onClick={reset} className="w-full py-3 sm:py-3.5 rounded-full border-2 border-ink/20 text-ink/60 font-semibold text-sm sm:text-xs tracking-widest uppercase hover:border-ink/40 transition active:scale-[0.98]">
                  Reset
                </button>
              </>
            )}
          </div>
        </motion.div>

        {/* RIGHT: STRIP PREVIEW (9:16 portrait, more square, tighter gap) */}
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }} className="md:col-span-5 w-full">
          <div className="relative max-w-[320px] mx-auto">
            <div className="absolute inset-0 rounded-md rotate-1 translate-x-1.5 translate-y-1.5 bg-gradient-to-br from-rose via-pink to-lavender" />

            <div className="relative paper rounded-md p-2 sm:p-2.5 shadow-2xl border-2 border-gold/60">
              <div className="absolute inset-1 rounded-sm border-2 border-rose/30 pointer-events-none" />
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-3.5 sm:h-4 bg-gold/70 rounded-sm rotate-[-3deg] shadow-md z-10" />

              {/* Preview — 9:16 portrait, wider frames, tight gap, small signature */}
              <div className="relative aspect-[9/16] bg-cream rounded-sm overflow-hidden border-2 border-ink/30">
                <div className="absolute inset-1.5 flex flex-col gap-0.5">
                  {/* 3 photos — tight gap */}
                  <div className="flex-1 flex flex-col gap-0.5">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="flex-1 bg-blush rounded-sm overflow-hidden relative flex items-center justify-center">
                        {photos[i] ? <img src={photos[i]} alt={`#${i + 1}`} className="w-full h-full object-cover" /> : <span className="text-base text-ink/30">📷</span>}
                      </div>
                    ))}
                  </div>
                  {/* Tiny signature block */}
                  <div className="shrink-0 text-center pt-1 pb-0.5">
                    <p className="font-caveat text-[7px] text-deep-rose italic leading-tight">hi there, im just finished my cemploo</p>
                    <p className="font-caveat text-[6px] text-rose/60 leading-tight">-cinti-</p>
                  </div>
                </div>
              </div>
            </div>

            <span className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 text-xl sm:text-2xl rotate-[-15deg] select-none drop-shadow-md z-20">🌸</span>
            <span className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 text-xl sm:text-2xl rotate-[15deg] select-none drop-shadow-md z-20">✨</span>
            <span className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 text-xl sm:text-2xl rotate-[10deg] select-none drop-shadow-md z-20">💖</span>
            <span className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 text-xl sm:text-2xl rotate-[-10deg] select-none drop-shadow-md z-20">🌷</span>
          </div>

          <div className="mt-5 sm:mt-6 max-w-[420px] mx-auto paper rounded-md p-4 border border-rose/20">
            <p className="font-caveat text-xs text-ink/50 uppercase tracking-wider mb-2">Cara pakai</p>
            <ul className="space-y-1.5 text-[11px] sm:text-xs text-ink/70 font-caveat">
              <li>• Klik "Aktifin Kamera" → izinin akses kamera</li>
              <li>• Klik "Mulai Foto" → countdown 3× berturut-turut</li>
              <li>
                • Download strip <strong>1080×1920 (9:16 portrait)</strong>
              </li>
              <li>• Pas untuk IG Story, WhatsApp Status, TikTok</li>
              <li>• Foto sesuai kamera — nggak di-mirror</li>
            </ul>
          </div>

          <div className="md:hidden mt-4 text-center">
            <p className="font-caveat text-sm text-ink/50">{photos.length}/3 foto</p>
          </div>
        </motion.div>
      </div>
    </EditorialSection>
  );
}
