import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Layers,
  QrCode,
  BarChart3,
  CheckCircle2,
  LockKeyhole,
  Loader2,
} from "lucide-react";
import { loginPayloadSchema, type LoginPayload } from "@/services/schemas/auth";
import { useLogin } from "@/services/mutations/auth";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginPayload>({
    resolver: zodResolver(loginPayloadSchema),
  });

  const loginMutation = useLogin(setError);

  const onSubmit = (data: LoginPayload) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen bg-white font-sans text-slate-900">
      {/* Left Section - Hero/Branding */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-gradient-to-b from-[#1E6CF6] via-[#1E6CF6] to-[#00C9A7] flex-col items-center justify-center p-12 text-white overflow-hidden">
        <div className="relative z-10 max-w-md text-center">
          <div className="mb-12 inline-block">
            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Ffb22e4cf099d4f3cbc5f8fb9845b8315%2Fe6d498e5293f413782f056ced81f14a4?format=webp&width=400"
                alt="Blockchain Illustration"
                className="w-56 h-56 object-contain rounded-2xl"
              />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold mb-6 tracking-tight leading-tight">
            Dashboard PTSBQB
          </h1>
          <p className="text-lg text-white/80 mb-12 leading-relaxed font-medium">
            Platform administrasi berbasis blockchain untuk transparansi dan
            akuntabilitas program bantuan sosial
          </p>
          <div className="flex items-center justify-center gap-8 text-sm font-bold text-white/90">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-white" />
              <span className="tracking-wide">Blockchain Secure</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span className="tracking-wide">Transparent</span>
            </div>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-white rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-400 rounded-full blur-[120px]" />
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-[55%] flex flex-col items-center justify-center p-6 sm:p-12 lg:p-24 bg-white">
        <div className="w-full max-w-[440px]">
          {/* Brand Logo */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-white shadow-sm shadow-blue-500/30 mb-4 transition-transform hover:scale-105 duration-300">
              <img
                src="/presidana-logo.svg"
                alt="Logo PTSBQB"
                className="size-8"
              />
            </div>
            <span className="text-2xl font-black text-slate-800 tracking-tighter">
              PTSBQB
            </span>
          </div>

          <div className="space-y-3 mb-10 text-center">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Masuk ke Dashboard PTSBQB
            </h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[320px] mx-auto">
              Kelola program bantuan sosial dengan transparansi blockchain
            </p>
          </div>

          {/* Akses Aman Banner */}
          <div className="bg-[#E6F9F5] border border-[#B3EFDF] rounded-2xl p-4 flex items-start gap-4 mb-10 shadow-sm shadow-emerald-500/5">
            <div className="mt-0.5 p-1.5 bg-[#10B981] rounded-lg text-white shadow-md shadow-emerald-500/20">
              <LockKeyhole className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-[#064E3B]">Akses Aman</p>
              <p className="text-[11px] text-[#047857] leading-relaxed font-semibold opacity-90">
                Dashboard ini dilindungi oleh sistem blockchain dan enkripsi
                OAuth 2.0
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2.5">
              <Label
                htmlFor="email"
                className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1"
              >
                Email
              </Label>
              <div className="relative group">
                <div
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                    errors.email
                      ? "text-red-500"
                      : "text-slate-400 group-focus-within:text-[#1E6CF6]"
                  }`}
                >
                  <Mail className="w-5 h-5" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@ptsbqb.id"
                  {...register("email")}
                  className={`pl-12 h-14 font-medium rounded-2xl transition-all ${
                    errors.email
                      ? "border-red-300 bg-red-50/50 focus:bg-red-50 focus:border-red-500 focus:ring-red-500/10"
                      : "border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#1E6CF6] focus:ring-[#1E6CF6]/10"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs font-semibold text-red-600 ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2.5">
              <Label
                htmlFor="password"
                className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1"
              >
                Password
              </Label>
              <div className="relative group">
                <div
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                    errors.password
                      ? "text-red-500"
                      : "text-slate-400 group-focus-within:text-[#1E6CF6]"
                  }`}
                >
                  <Lock className="w-5 h-5" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={`pl-12 pr-12 h-14 font-medium rounded-2xl transition-all ${
                    errors.password
                      ? "border-red-300 bg-red-50/50 focus:bg-red-50 focus:border-red-500 focus:ring-red-500/10"
                      : "border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#1E6CF6] focus:ring-[#1E6CF6]/10"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1E6CF6] transition-colors p-1"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-semibold text-red-600 ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember & Forgot Password */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2.5">
                <Checkbox
                  id="remember"
                  className="w-5 h-5 rounded-lg border-slate-300 data-[state=checked]:bg-[#1E6CF6] data-[state=checked]:border-[#1E6CF6] transition-all"
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-slate-600 font-bold cursor-pointer select-none"
                >
                  Ingat saya
                </Label>
              </div>
              <Link
                to="#"
                className="text-sm font-bold text-[#1E6CF6] hover:text-blue-700 transition-colors"
              >
                Lupa kata sandi?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || loginMutation.isPending}
              className="w-full h-14 bg-[#1E6CF6] hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white text-base font-black rounded-2xl shadow-xl shadow-blue-500/25 transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
            >
              {isSubmitting || loginMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                "Masuk Sekarang"
              )}
            </Button>
          </form>

          {/* Footer Integration Tags */}
          <div className="mt-16 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-center gap-8 text-slate-400">
            <div className="flex items-center gap-2 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
              <Layers className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-[0.15em] font-black">
                Hyperledger Fabric
              </span>
            </div>
            <div className="flex items-center gap-2 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
              <QrCode className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-[0.15em] font-black">
                QRIS Integration
              </span>
            </div>
            <div className="flex items-center gap-2 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
              <BarChart3 className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-[0.15em] font-black">
                Real-time Analytics
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
