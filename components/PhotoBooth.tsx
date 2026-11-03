"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Cropper from "react-easy-crop";
import EditorialSection from "./EditorialSection";

type Status = "idle" | "requesting" | "ready" | "capturing" | "captured" | "error";
type Mode = "camera" | "upload";

type CropModal = {
  slotIndex: number;
  imageSrc: string;
};

const ASPECT = 4 / 3;

export default function PhotoBooth() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [mode, setMode] = useState<Mode>("camera");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);

  // Upload + crop states
  const [pendingSlot, setPendingSlot] = useState<number>(0);
  const [cropModal, setCropModal] = useState<CropModal | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [savingCrop, setSavingCrop] = useState(false);

  const photoCount = photos.filter(Boolean).length;

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleModeChange = (newMode: Mode) => {
    if (newMode === mode) return;
    stopCamera();
    setMode(newMode);
    setPhotos([null, null, null]);
    setStatus("idle");
    setErrorMsg("");
    setCountdown(null);
  };

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

  // Capture 4:3 landscape
  const capturePhoto = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const W = 1200;
    const H = 900;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const vw = video.videoWidth || 640;
    const vh = video.videoHeight || 480;
    const targetAspect = W / H;

    let sw = vw;
    let sh = vh;
    let sx = 0;
    let sy = 0;

    if (vw / vh > targetAspect) {
      sh = vh;
      sw = vh * targetAspect;
      sx = (vw - sw) / 2;
    } else {
      sw = vw;
      sh = vw / targetAspect;
      sy = (vh - sh) / 2;
    }

    ctx.save();
    ctx.translate(W, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, W, H);
    ctx.restore();

    return canvas.toDataURL("image/jpeg", 0.9);
  };

  const takePhotos = async () => {
    if (!streamRef.current) return;
    setPhotos([null, null, null]);
    setStatus("capturing");
    const shots: (string | null)[] = [null, null, null];

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
        shots[i] = photo;
        setPhotos([...shots]);
      }
      await new Promise((r) => setTimeout(r, 500));
    }

    stopCamera();
    setStatus("captured");
  };

  // ===== UPLOAD / CROP =====
  const handleSlotClick = (index: number) => {
    setPendingSlot(index);
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Pilih file gambar ya (jpg/png/webp)");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCropModal({
        slotIndex: pendingSlot,
        imageSrc: reader.result as string,
      });
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => resolve(img));
      img.addEventListener("error", reject);
      img.src = url;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No 2d context");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
    return canvas.toDataURL("image/jpeg", 0.9);
  };

  const handleCropSave = async () => {
    if (!cropModal || !croppedAreaPixels) return;
    setSavingCrop(true);
    try {
      const croppedImage = await getCroppedImg(cropModal.imageSrc, croppedAreaPixels);
      setPhotos((prev) => {
        const next = [...prev];
        next[cropModal.slotIndex] = croppedImage;
        return next;
      });
      setCropModal(null);
    } catch (err) {
      console.error("Gagal crop:", err);
    } finally {
      setSavingCrop(false);
    }
  };

  const handleCropCancel = () => {
    setCropModal(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  const handleRemoveSlot = (index: number) => {
    setPhotos((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  // ===== STRIP RENDER (sama kayak sebelumnya) =====
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

  const drawMarginDecorations = (ctx: CanvasRenderingContext2D, cardIndex: number, cy: number, W: number, CARD_X: number, CARD_W: number, CARD_H: number) => {
    type Decor = { emoji: string; x: number; y: number; size: number; rotate: number };

    const leftMarginStart = 30;
    const leftMarginEnd = CARD_X - 20;
    const rightMarginStart = CARD_X + CARD_W + 20;
    const rightMarginEnd = W - 30;

    const pickX = (side: "left" | "right", pct: number) => {
      if (side === "left") return leftMarginStart + (leftMarginEnd - leftMarginStart) * pct;
      return rightMarginStart + (rightMarginEnd - rightMarginStart) * pct;
    };

    const DECOR_SETS: { left: Decor[]; right: Decor[] }[] = [
      {
        left: [
          { emoji: "🌸", x: pickX("left", 0.3), y: 80, size: 46, rotate: -15 },
          { emoji: "🐱", x: pickX("left", 0.6), y: 220, size: 58, rotate: 8 },
          { emoji: "🦋", x: pickX("left", 0.3), y: 240, size: 34, rotate: 10 },
          { emoji: "✨", x: pickX("left", 0.8), y: 260, size: 24, rotate: 0 },
          { emoji: "🍃", x: pickX("left", 0.4), y: 400, size: 40, rotate: 20 },
          { emoji: "⭐", x: pickX("left", 0.7), y: 480, size: 32, rotate: -10 },
        ],
        right: [
          { emoji: "⭐", x: pickX("right", 0.4), y: 100, size: 36, rotate: 15 },
          { emoji: "🐱", x: pickX("right", 0.5), y: 260, size: 58, rotate: -8 },
          { emoji: "🦋", x: pickX("right", 0.7), y: 280, size: 34, rotate: -10 },
          { emoji: "✨", x: pickX("right", 0.3), y: 280, size: 24, rotate: 0 },
          { emoji: "💗", x: pickX("right", 0.6), y: 440, size: 40, rotate: -15 },
          { emoji: "🌸", x: pickX("right", 0.3), y: 500, size: 32, rotate: 10 },
        ],
      },
      {
        left: [
          { emoji: "🦋", x: pickX("left", 0.5), y: 100, size: 40, rotate: 25 },
          { emoji: "🌷", x: pickX("left", 0.3), y: 260, size: 46, rotate: -20 },
          { emoji: "✨", x: pickX("left", 0.8), y: 340, size: 26, rotate: 0 },
          { emoji: "🍵", x: pickX("left", 0.5), y: 450, size: 44, rotate: 5 },
          { emoji: "💗", x: pickX("left", 0.85), y: 140, size: 32, rotate: 15 },
        ],
        right: [
          { emoji: "😸", x: pickX("right", 0.5), y: 100, size: 54, rotate: -15 },
          { emoji: "🦋", x: pickX("right", 0.85), y: 100, size: 34, rotate: 10 },
          { emoji: "🌟", x: pickX("right", 0.85), y: 210, size: 34, rotate: 0 },
          { emoji: "🌸", x: pickX("right", 0.3), y: 310, size: 44, rotate: 20 },
          { emoji: "💗", x: pickX("right", 0.85), y: 430, size: 38, rotate: -10 },
          { emoji: "✨", x: pickX("right", 0.5), y: 500, size: 28, rotate: 0 },
        ],
      },
      {
        left: [
          { emoji: "⭐", x: pickX("left", 0.3), y: 120, size: 38, rotate: -25 },
          { emoji: "🐱", x: pickX("left", 0.7), y: 260, size: 54, rotate: 10 },
          { emoji: "✨", x: pickX("left", 0.3), y: 260, size: 24, rotate: 0 },
          { emoji: "💗", x: pickX("left", 0.6), y: 390, size: 38, rotate: -5 },
          { emoji: "🍃", x: pickX("left", 0.85), y: 490, size: 34, rotate: 15 },
        ],
        right: [
          { emoji: "🌸", x: pickX("right", 0.6), y: 100, size: 42, rotate: 20 },
          { emoji: "🐱", x: pickX("right", 0.4), y: 250, size: 54, rotate: -12 },
          { emoji: "🦋", x: pickX("right", 0.75), y: 250, size: 32, rotate: 5 },
          { emoji: "✨", x: pickX("right", 0.9), y: 270, size: 24, rotate: 0 },
          { emoji: "🌷", x: pickX("right", 0.4), y: 410, size: 40, rotate: 15 },
          { emoji: "🌟", x: pickX("right", 0.75), y: 500, size: 34, rotate: -20 },
        ],
      },
    ];

    const set = DECOR_SETS[cardIndex % DECOR_SETS.length];

    const dotColors = ["#FF8FAB", "#FFC1D5", "#F0C979", "#E0C9F0", "#8FA88F"];
    const leftDots = Array.from({ length: 8 }).map(() => ({
      x: leftMarginStart + Math.random() * (leftMarginEnd - leftMarginStart),
      y: Math.random() * CARD_H,
      size: 3 + Math.random() * 3,
    }));
    const rightDots = Array.from({ length: 8 }).map(() => ({
      x: rightMarginStart + Math.random() * (rightMarginEnd - rightMarginStart),
      y: Math.random() * CARD_H,
      size: 3 + Math.random() * 3,
    }));

    ctx.save();
    ctx.globalAlpha = 0.35;
    [...leftDots, ...rightDots].forEach((d, i) => {
      ctx.fillStyle = dotColors[i % dotColors.length];
      ctx.beginPath();
      ctx.arc(d.x, cy + d.y, d.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "#FFFFFF";
    [...leftDots.slice(0, 4), ...rightDots.slice(0, 4)].forEach((d) => {
      ctx.beginPath();
      ctx.arc(d.x, cy + d.y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    set.left.forEach((d) => {
      ctx.save();
      ctx.globalAlpha = 0.8;
      ctx.translate(d.x, cy + d.y);
      ctx.rotate((d.rotate * Math.PI) / 180);
      ctx.font = `${d.size}px serif`;
      ctx.fillText(d.emoji, 0, 0);
      ctx.restore();
    });
    set.right.forEach((d) => {
      ctx.save();
      ctx.globalAlpha = 0.8;
      ctx.translate(d.x, cy + d.y);
      ctx.rotate((d.rotate * Math.PI) / 180);
      ctx.font = `${d.size}px serif`;
      ctx.fillText(d.emoji, 0, 0);
      ctx.restore();
    });
  };

  const downloadStrip = async () => {
    const validPhotos = photos.filter((p): p is string => !!p);
    if (validPhotos.length !== 3) return;
    try {
      const imgs = await Promise.all(validPhotos.map(loadImage));

      const W = 1080;
      const H = 1920;
      const PAD_TOP = 30;
      const CARD_W = 780;
      const CARD_H = 585;
      const CARD_X = Math.round((W - CARD_W) / 2);
      const GAP = 8;
      const PHOTO_PAD = 16;
      const PHOTO_W = CARD_W - PHOTO_PAD * 2;
      const PHOTO_H = CARD_H - PHOTO_PAD * 2;

      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#FFF9F3");
      bg.addColorStop(1, "#FFE5EC");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

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

      ctx.font = "32px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🌸", 42, 42);
      ctx.fillText("✨", W - 42, 42);
      ctx.fillText("💖", 42, H - 42);
      ctx.fillText("🌷", W - 42, H - 42);

      for (let i = 0; i < 3; i++) {
        const cy = PAD_TOP + i * (CARD_H + GAP);
        drawMarginDecorations(ctx, i, cy, W, CARD_X, CARD_W, CARD_H);
      }

      for (let i = 0; i < 3; i++) {
        const cy = PAD_TOP + i * (CARD_H + GAP);

        ctx.fillStyle = "rgba(74, 46, 58, 0.12)";
        ctx.fillRect(CARD_X + 3, cy + 3, CARD_W, CARD_H);

        ctx.fillStyle = "#FFF9F3";
        ctx.fillRect(CARD_X, cy, CARD_W, CARD_H);

        drawCover(ctx, imgs[i], CARD_X + PHOTO_PAD, cy + PHOTO_PAD, PHOTO_W, PHOTO_H);

        ctx.strokeStyle = "#4A2E3A";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(CARD_X + PHOTO_PAD, cy + PHOTO_PAD, PHOTO_W, PHOTO_H);
      }

      const lastCardEnd = PAD_TOP + 3 * CARD_H + 2 * GAP;
      const sigY = lastCardEnd + 55;

      ctx.fillStyle = "#C73E68";
      ctx.font = "italic 30px Georgia, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("hi there, im just finished my cemploo", W / 2, sigY);

      ctx.fillStyle = "#FF8FAB";
      ctx.font = "italic 24px Georgia, serif";
      ctx.fillText("-cinti-", W / 2, sigY + 42);

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
    setPhotos([null, null, null]);
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
      subtitle="Foto langsung pakai kamera atau upload dari galeri"
      meta={
        <div className="hidden md:flex flex-col items-end gap-1">
          <span className="stamp">Selfie ✿</span>
          <span className="font-caveat text-xs text-ink/40 mt-2 tabular-nums">{photoCount}/3</span>
        </div>
      }
    >
      <canvas ref={canvasRef} className="hidden" />
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

      {/* Mode Selector */}
      <div className="max-w-md mx-auto mb-8">
        <div className="flex gap-1 p-1 bg-blush rounded-full border-2 border-rose/20">
          <button
            onClick={() => handleModeChange("camera")}
            className={`flex-1 py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition ${mode === "camera" ? "bg-deep-rose text-cream shadow-md" : "text-deep-rose/70 hover:text-deep-rose"}`}
          >
            📷 Kamera
          </button>
          <button
            onClick={() => handleModeChange("upload")}
            className={`flex-1 py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition ${mode === "upload" ? "bg-deep-rose text-cream shadow-md" : "text-deep-rose/70 hover:text-deep-rose"}`}
          >
            📤 Upload
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-start">
        {/* LEFT: KAMERA / UPLOAD */}
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="md:col-span-7 w-full">
          <div className="relative max-w-[560px] mx-auto md:max-w-full">
            <div className="absolute inset-0 rounded-md rotate-1 translate-x-1 translate-y-1 bg-gradient-to-br from-rose via-pink to-lavender" />

            <div className="relative paper rounded-md p-2 shadow-2xl border-2 border-gold/60 sm:p-2.5">
              <div className="absolute inset-1 rounded-sm border-2 border-rose/40 pointer-events-none z-10" />
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 sm:w-24 h-4 sm:h-5 bg-gold/70 rounded-sm rotate-[-3deg] shadow-md z-20" />

              {mode === "camera" ? (
                <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-ink">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      opacity: status === "ready" || status === "capturing" ? 1 : 0,
                      transform: "scaleX(-1)",
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
                      foto {Math.min(photoCount + (countdown !== null ? 1 : 0), 3)}/3
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
              ) : (
                /* Upload Mode */
                <div className="space-y-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="relative">
                      <button
                        onClick={() => handleSlotClick(i)}
                        className={`relative w-full aspect-[4/3] rounded-sm overflow-hidden border-2 transition ${photos[i] ? "border-gold/60 bg-blush" : "border-dashed border-rose/40 bg-blush hover:border-rose hover:bg-rose/5"}`}
                      >
                        {photos[i] ? (
                          <img src={photos[i]!} alt={`Slot ${i + 1}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
                            <span className="text-4xl text-rose/60">📤</span>
                            <p className="font-caveat text-base text-deep-rose">klik buat upload foto {i + 1}</p>
                            <p className="font-caveat text-xs text-rose/60">jpg / png / webp</p>
                          </div>
                        )}

                        {/* Slot number badge */}
                        <div className="absolute top-2 left-2 bg-ink/70 backdrop-blur px-2.5 py-1 rounded-full text-cream font-caveat text-xs">#{i + 1}</div>
                      </button>

                      {/* Remove button (only if filled) */}
                      {photos[i] && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveSlot(i);
                          }}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-ink/80 text-cream flex items-center justify-center hover:bg-rose transition text-sm"
                          aria-label="Hapus foto"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="relative mt-1.5 sm:mt-2 rounded-sm bg-gradient-to-r from-pink via-rose to-pink px-3 sm:px-4 py-2 sm:py-2.5 text-center">
                <p className="font-caveat text-xs sm:text-sm md:text-base text-cream italic">hi there, im just finished my cemploo</p>
              </div>
            </div>

            <span className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 text-2xl sm:text-3xl rotate-[-15deg] select-none drop-shadow-md z-30">🌸</span>
            <span className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 text-2xl sm:text-3xl rotate-[15deg] select-none drop-shadow-md z-30">✨</span>
            <span className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 text-2xl sm:text-3xl rotate-[10deg] select-none drop-shadow-md z-30">💖</span>
            <span className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 text-2xl sm:text-3xl rotate-[-10deg] select-none drop-shadow-md z-30">🌷</span>
          </div>

          {/* Action buttons */}
          <div className="mt-4 sm:mt-5 flex flex-col gap-2 max-w-[560px] mx-auto md:max-w-full">
            {mode === "camera" && (
              <>
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
                    Jangan gerak... ({photoCount}/3)
                  </button>
                )}
                {status === "error" && (
                  <button onClick={startCamera} className="w-full bg-deep-rose text-cream py-4 sm:py-3.5 rounded-full font-semibold text-sm sm:text-xs tracking-widest uppercase hover:bg-rose transition shadow-lg active:scale-[0.98]">
                    🔄 Coba Lagi
                  </button>
                )}
              </>
            )}

            {photoCount === 3 && (
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
          </div>
        </motion.div>

        {/* RIGHT: STRIP PREVIEW */}
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }} className="md:col-span-5 w-full">
          <div className="relative max-w-[320px] mx-auto">
            <div className="absolute inset-0 rounded-md rotate-1 translate-x-1.5 translate-y-1.5 bg-gradient-to-br from-rose via-pink to-lavender" />

            <div className="relative paper rounded-md p-2 sm:p-2.5 shadow-2xl border-2 border-gold/60">
              <div className="absolute inset-1 rounded-sm border-2 border-rose/30 pointer-events-none" />
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-3.5 sm:h-4 bg-gold/70 rounded-sm rotate-[-3deg] shadow-md z-10" />

              <div className="relative aspect-[9/16] bg-cream rounded-sm overflow-hidden border-2 border-ink/30">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="absolute bg-blush rounded-sm overflow-hidden flex items-center justify-center"
                    style={{
                      left: "15%",
                      top: `${2 + i * 29.7}%`,
                      width: "70%",
                      aspectRatio: "4 / 3",
                    }}
                  >
                    {photos[i] ? <img src={photos[i]!} alt={`#${i + 1}`} className="w-full h-full object-cover" /> : <span className="text-ink/30 text-base select-none">📷</span>}
                  </div>
                ))}

                <div className="absolute left-0 right-0 text-center" style={{ top: "94%" }}>
                  <p className="font-caveat text-[6px] text-deep-rose italic leading-tight">hi there, im just finished my cemploo</p>
                  <p className="font-caveat text-[5px] text-rose/60 leading-tight">-cinti-</p>
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
              <li>
                • Pilih mode: <strong>Kamera</strong> atau <strong>Upload</strong>
              </li>
              <li>• Kamera: klik "Aktifin Kamera" → "Mulai Foto"</li>
              <li>• Upload: klik tiap slot → pilih foto → crop 4:3</li>
              <li>
                • Download strip <strong>1080×1920 (9:16 portrait)</strong>
              </li>
              <li>• Foto selfie-style (mirror, sesuai yang kamu lihat)</li>
            </ul>
          </div>

          <div className="md:hidden mt-4 text-center">
            <p className="font-caveat text-sm text-ink/50">{photoCount}/3 foto</p>
          </div>
        </motion.div>
      </div>

      {/* CROP MODAL */}
      <AnimatePresence>
        {cropModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] bg-ink flex flex-col" style={{ height: "100dvh" }}>
            {/* Header — solid bg, compact */}
            <div className="shrink-0 flex items-center justify-between px-4 py-3 bg-ink border-b-2 border-rose/30">
              <div>
                <p className="font-caveat text-[10px] sm:text-xs text-rose uppercase tracking-widest">— foto #{cropModal.slotIndex + 1} —</p>
                <p className="font-pacifico text-base sm:text-lg text-cream leading-tight">Adjust photo</p>
              </div>
              <button onClick={handleCropCancel} className="w-11 h-11 rounded-full bg-cream/15 text-cream hover:bg-cream/25 active:scale-95 transition flex items-center justify-center text-lg border border-cream/30" aria-label="Close">
                ✕
              </button>
            </div>

            {/* Cropper area — flexible, takes remaining height */}
            <div className="relative flex-1 min-h-0 bg-black">
              <Cropper
                image={cropModal.imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={ASPECT}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_area, areaPixels) => setCroppedAreaPixels(areaPixels)}
                objectFit="contain"
                showGrid={true}
                style={{
                  containerStyle: {
                    width: "100%",
                    height: "100%",
                    background: "#000",
                  },
                  cropAreaStyle: {
                    border: "2px solid #FF8FAB",
                    borderRadius: "6px",
                    boxShadow: "0 0 0 9999em rgba(10, 10, 10, 0.75)",
                  },
                }}
              />
            </div>

            {/* Controls — solid bg, safe-area padding */}
            <div className="shrink-0 bg-ink border-t-2 border-rose/30 px-4 pt-3" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
              {/* Zoom — single horizontal row, compact */}
              <div className="flex items-center gap-2.5 mb-2.5">
                <span className="font-caveat text-xs text-cream font-semibold whitespace-nowrap">🔍</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 cursor-pointer rounded-full"
                  style={{
                    appearance: "none",
                    WebkitAppearance: "none",
                    height: "8px",
                    background: "rgba(255, 249, 243, 0.15)",
                    outline: "none",
                    accentColor: "#FF8FAB",
                  }}
                />
                <span className="font-caveat text-xs text-cream bg-cream/15 px-2 py-0.5 rounded-full tabular-nums min-w-[46px] text-center">{Math.round(zoom * 100)}%</span>
              </div>

              {/* Buttons — langsung di bawah slider */}
              <div className="flex gap-3">
                <button
                  onClick={handleCropCancel}
                  className="flex-1 min-h-[52px] rounded-xl bg-cream text-deep-rose font-bold text-sm tracking-widest uppercase border-[3px] border-deep-rose hover:bg-blush active:scale-[0.97] transition shadow-lg"
                >
                  ✕ Batal
                </button>
                <button
                  onClick={handleCropSave}
                  disabled={savingCrop || !croppedAreaPixels}
                  className="flex-1 min-h-[52px] rounded-xl bg-deep-rose text-cream font-bold text-sm tracking-widest uppercase border-[3px] border-cream hover:bg-rose active:scale-[0.97] transition shadow-lg disabled:opacity-50 disabled:cursor-wait"
                >
                  {savingCrop ? "..." : "✓ Simpan"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </EditorialSection>
  );
}
