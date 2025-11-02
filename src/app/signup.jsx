import { GalleryVerticalEnd, Sparkles } from "lucide-react";

import sideBackground from "@/assets/side-background.jpg";

import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gradient-light via-background to-gradient-dark">
      {/* Glows décoratifs brand */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-[28rem] w-[28rem] rounded-full bg-brand/10 blur-[100px]" />

      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Colonne gauche: carte d'inscription */}
        <div className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-xl">
            {/* Header marque */}
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-lg shadow">
                <GalleryVerticalEnd className="size-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bienvenue sur</p>
                <h1 className="text-2xl font-bold tracking-tight text-brand">The Mind</h1>
              </div>
            </div>

            {/* Carte glassmorphism */}
            <div className="rounded-2xl border bg-card/60 backdrop-blur-xl shadow-[0_8px_60px_oklch(0.70_0.19_48_/_0.25)]">
              <div className="p-6 md:p-8">
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-brand/15 px-3 py-1 text-xs text-brand">
                    <Sparkles className="size-3" />
                    Créez votre compte
                  </div>
                  <p className="mt-3 text-lg font-semibold text-foreground">Rejoignez la communauté et commencez à jouer.</p>
                  <p className="text-sm text-muted-foreground">Quelques secondes suffisent — aucune carte n'est requise.</p>
                </div>
                <SignupForm className="mt-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Colonne droite: visuel */}
        <div className="relative hidden lg:block">
          <img
            src={sideBackground}
            alt="Paysage nocturne étoilé"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.35]"
          />
          {/* Overlay thème pour lisibilité */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />

          {/* Watermark texte "The Mind" */}
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <span className="select-none font-black tracking-tight text-foreground/15 text-[clamp(3rem,12vw,12rem)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]">
              The Mind
            </span>
          </div>

          {/* Badge slogan */}

          {/* 
          <div className="absolute left-6 top-6 rounded-full bg-background/70 px-4 py-2 text-xs text-foreground backdrop-blur-sm border border-border">
            Synchronisez vos esprits
          </div> 
          */}

          {/* Crédit photo */}
          <div className="absolute bottom-4 right-4 text-xs drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Photo by{" "}
            <a
              href="https://unsplash.com/@mohamadaz?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
              className="underline hover:text-brand transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mohammad Alizade
            </a>
            {" "}on{" "}
            <a
              href="https://unsplash.com/photos/desert-under-starry-sky-S5uV7ro4UPY?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
              className="underline hover:text-brand transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unsplash
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
