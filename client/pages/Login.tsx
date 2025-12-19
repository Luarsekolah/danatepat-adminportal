import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("admin@danatepat.id");
  const [password, setPassword] = useState("password123");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would authenticate here
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* Left Section - Hero/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#1E6CF6] via-[#1E6CF6] to-[#00D4FF] flex-col items-center justify-center p-12 text-white">
        <div className="max-w-md text-center">
          <div className="mb-8 inline-block p-4 bg-white/10 backdrop-blur-md rounded-2xl">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Ffb22e4cf099d4f3cbc5f8fb9845b8315%2Fe6d498e5293f413782f056ced81f14a4?format=webp&width=400"
              alt="Blockchain Illustration"
              className="w-64 h-64 object-contain opacity-90"
            />
          </div>
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight">
            Dashboard DANA TEPAT
          </h1>
          <p className="text-lg text-blue-50/90 mb-8 leading-relaxed">
            Platform administrasi berbasis blockchain untuk transparansi dan
            akuntabilitas program bantuan sosial
          </p>
          <div className="flex items-center justify-center gap-6 text-sm font-medium text-blue-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Blockchain Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Transparent</span>
            </div>
          </div>
        </div>

        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-black/5 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-24 bg-slate-50">
        <div className="w-full max-w-[420px]">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 justify-center lg:justify-start">
            <div className="w-10 h-10 bg-[#1E6CF6] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Layers className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-slate-800 tracking-tight">
              DANA TEPAT
            </span>
          </div>

          <div className="space-y-2 mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-slate-900">
              Masuk ke Dashboard DANA TEPAT
            </h2>
            <p className="text-slate-500 text-sm">
              Kelola program bantuan sosial dengan transparansi blockchain
            </p>
          </div>

          {/* Secure Access Banner */}
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 flex items-start gap-3 mb-8">
            <div className="mt-0.5 p-1 bg-emerald-500 rounded-md text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-emerald-900">
                Akses Aman
              </p>
              <p className="text-xs text-emerald-700 leading-relaxed">
                Dashboard ini dilindungi oleh sistem blockchain dan enkripsi
                OAuth 2.0
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                Email
              </Label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1E6CF6] transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@danatepat.id"
                  className="pl-10 h-11 border-slate-200 focus:border-[#1E6CF6] focus:ring-[#1E6CF6]/10 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                Password
              </Label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1E6CF6] transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11 border-slate-200 focus:border-[#1E6CF6] focus:ring-[#1E6CF6]/10 rounded-xl"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  className="rounded-md border-slate-300 data-[state=checked]:bg-[#1E6CF6] data-[state=checked]:border-[#1E6CF6]"
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-slate-600 font-medium cursor-pointer"
                >
                  Ingat saya
                </Label>
              </div>
              <Link
                to="#"
                className="text-sm font-semibold text-[#1E6CF6] hover:underline"
              >
                Lupa kata sandi?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#1E6CF6] hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
            >
              Masuk Sekarang
            </Button>

            <p className="text-center text-slate-500 text-sm">
              Belum punya akun?{" "}
              <Link
                to="#"
                className="font-semibold text-[#1E6CF6] hover:underline"
              >
                Daftar
              </Link>
            </p>
          </form>

          {/* Footer Features */}
          <div className="mt-12 pt-8 border-t border-slate-200 flex flex-wrap items-center justify-center gap-6 text-slate-400">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-wider font-bold">
                Hyperledger Fabric
              </span>
            </div>
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-wider font-bold">
                QRIS Integration
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-wider font-bold">
                Real-time Analytics
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
