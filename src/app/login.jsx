import { LoginForm } from "@/components/login-form";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
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
          src="https://m.media-amazon.com/images/I/511-DNZiXcL._UF894,1000_QL80_.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
