import { LoginForm } from "@/components/login-form";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import sideBg from "@/assets/login-side-background.jpg";
export default function Login() {
  const { user } = useAuth();

  return user ? (
    <Navigate to="/" />
  ) : (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src={sideBg}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
        {/* Watermark texte "The Mind" */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <span className="select-none font-black tracking-tight text-foreground/15 text-[clamp(3rem,12vw,12rem)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]">
            The Mind
          </span>
        </div>
      </div>
    </div>
  );
}
