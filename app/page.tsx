"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";
import CurtainLanding from "@/components/CurtainLanding";
import GiftBoxGate from "@/components/GiftBoxGate";
import Card from "@/components/Card";
import MatchaFortune from "@/components/MatchaFortune";
import CatJump from "@/components/CatJump";
import CatCatch from "@/components/CatCatch";
import Quiz from "@/components/Quiz";
import SurvivalKit from "@/components/SurvivalKit";
import WishJar from "@/components/WishJar";
import StickerGrid from "@/components/StickerGrid";
import PhotoBooth from "@/components/PhotoBooth";
import AchievementBadge from "@/components/AchievementBadge";
import Footer from "@/components/Footer";
import Background from "@/components/Background";
import SideDecorations from "@/components/SideDecorations";
import FlyingCat from "@/components/FlyingCat";
import CustomCursor from "@/components/CustomCursor";
import CatCursor from "@/components/CatCursor";
import MatchaProgress from "@/components/MatchaProgress";
import KonamiCode from "@/components/KonamiCode";
import MusicToggle from "@/components/MusicToggle";
import ResponseForm from "@/components/ResponseForm";
import FakeError from "@/components/FakeError";
import HumanCheckGate from "@/components/HumanCheckGate";
import Receipt from "@/components/Receipt";

type Phase = "landing" | "gift" | "content";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<Phase>("landing");

  useEffect(() => {
    if (loading) return;
    document.body.style.overflow = phase === "content" ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading, phase]);

  return (
    <main className="relative min-h-screen w-full">
      <Background />
      <SideDecorations />
      <FlyingCat />
      <CustomCursor />
      <CatCursor />
      <KonamiCode />
      {!loading && phase === "content" && <MatchaProgress />}

      <AnimatePresence>{loading && <LoadingScreen onDone={() => setLoading(false)} />}</AnimatePresence>

      {!loading && (
        <>
          <MusicToggle />

          {phase === "gift" && <GiftBoxGate onOpen={() => setPhase("content")} />}

          {phase === "content" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }} className="relative z-10 w-full">
              <Card />
              <MatchaFortune />
              <CatJump />
              <CatCatch />
              <Quiz />
              <SurvivalKit />
              <WishJar />
              <StickerGrid />
              <PhotoBooth />
              <AchievementBadge />
              <HumanCheckGate />
              <FakeError />

              <section className="relative py-24 md:py-40 overflow-hidden">
                <div className="absolute top-0 left-6 right-6 md:left-16 md:right-16 editorial-rule" />
                <span aria-hidden className="bg-num text-[30vw] -left-8 bottom-0 hidden md:block">
                  10
                </span>
                <div className="mx-auto max-w-7xl px-6 md:px-16 relative z-10">
                  <div className="grid grid-cols-12 gap-6 md:gap-12 items-start">
                    <div className="col-span-12 md:col-span-6">
                      <p className="font-caveat text-2xl text-rose mb-3">Last but nah Leastt,</p>
                      <h2 className="font-pacifico text-deep-rose text-[clamp(2.5rem,6vw,5rem)] leading-[1.05]">
                        Udah kelar,
                        <br />
                        <em className="italic">Cinn.</em>
                      </h2>
                      <p className="mt-8 max-w-md font-caveat text-lg text-ink/60 leading-relaxed">
                        Kamu tetap bisa baca ataupun akses ini kapan aja kok, manatau mau terus terus-an pake photobooth nya. Kalo mau req grid nya juga bolehh wkwkw{" "}
                      </p>
                      <p className="font-caveat text-sm text-ink/40 mt-8">dev by mybabyshane</p>
                    </div>
                    <div className="col-span-12 md:col-span-6 md:pl-12">
                      <ResponseForm />
                      <div className="mt-4 flex justify-center">
                        <Receipt />
                      </div>
                    </div>
                  </div>
                  <div className="mt-16 pt-6 border-t border-rose/20 flex items-center justify-between">
                    <span className="font-caveat text-xs text-ink/40">— 10 · End —</span>
                    <span className="font-caveat text-xs text-ink/40">tengss yakk dah baca sampe habisss</span>
                  </div>
                </div>
              </section>
              <Footer />
            </motion.div>
          )}

          {phase === "landing" && <CurtainLanding onDone={() => setPhase("gift")} />}
        </>
      )}
    </main>
  );
}
