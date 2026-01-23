"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Users } from "lucide-react";

export default function AgencyLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement agency login
    console.log("Agency login:", formData);
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-black">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 via-black to-brand-blue/10" />

      {/* Glow effects */}
      <div className="absolute top-1/4 left-0 h-64 w-64 rounded-full bg-brand-purple/20 blur-3xl" />
      <div className="absolute bottom-1/4 right-0 h-64 w-64 rounded-full bg-brand-blue/20 blur-3xl" />

      <div className="relative z-10 flex flex-1 flex-col p-6">
        {/* Header */}
        <div className="flex items-center gap-4 pt-4">
          <Link
            href="/onboarding/select-type"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900/80 transition-colors hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </Link>
          <div>
            <p className="text-xs text-brand-purple uppercase tracking-wider font-medium">
              Agencia
            </p>
            <h1 className="text-xl font-bold text-white">Iniciar Sesión</h1>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mt-6 flex gap-1">
          <div className="h-1 flex-1 rounded-full bg-brand-purple" />
          <div className="h-1 flex-1 rounded-full bg-gray-800" />
          <div className="h-1 flex-1 rounded-full bg-gray-800" />
        </div>

        {/* Icon */}
        <div className="mt-10 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-purple/20 border border-brand-purple/30">
            <Users className="h-10 w-10 text-brand-purple" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 flex-1 space-y-4">
          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-400">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="agencia@ejemplo.com"
                className="w-full rounded-xl bg-gray-900/80 border border-gray-800 py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-400">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="••••••••"
                className="w-full rounded-xl bg-gray-900/80 border border-gray-800 py-4 pl-12 pr-12 text-white placeholder-gray-600 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <Link
              href="/onboarding/agency/forgot-password"
              className="text-sm text-brand-purple hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </form>

        {/* Footer */}
        <div className="space-y-4 pb-6">
          {/* Login button */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full rounded-full bg-gradient-to-r from-brand-purple to-brand-blue py-4 text-center font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-brand-purple/30 active:scale-[0.98]"
          >
            Iniciar Sesión
          </button>

          {/* Register link */}
          <p className="text-center text-sm text-gray-500">
            ¿No tienes cuenta de agencia?{" "}
            <Link
              href="/onboarding/agency/register"
              className="text-brand-purple hover:underline font-medium"
            >
              Registrarse
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
