"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Building,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Users,
  Check,
} from "lucide-react";

export default function AgencyRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    agencyName: "",
    contactName: "",
    email: "",
    phone: "",
    password: "",
    creatorsCount: "",
  });

  const creatorsOptions = [
    { value: "1-5", label: "1-5 creadores" },
    { value: "6-20", label: "6-20 creadores" },
    { value: "21-50", label: "21-50 creadores" },
    { value: "50+", label: "Más de 50 creadores" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
    } else {
      // TODO: Implement agency registration
      console.log("Agency register:", formData);
    }
  };

  const passwordRequirements = [
    { met: formData.password.length >= 8, text: "Mínimo 8 caracteres" },
    { met: /[A-Z]/.test(formData.password), text: "Una mayúscula" },
    { met: /[a-z]/.test(formData.password), text: "Una minúscula" },
    { met: /[0-9]/.test(formData.password), text: "Un número" },
  ];

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
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : null)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900/80 transition-colors hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div>
            <p className="text-xs text-brand-purple uppercase tracking-wider font-medium">
              Agencia - Paso {step} de 2
            </p>
            <h1 className="text-xl font-bold text-white">
              {step === 1 ? "Datos de la Agencia" : "Crea tu Cuenta"}
            </h1>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mt-6 flex gap-1">
          <div
            className={`h-1 flex-1 rounded-full transition-colors ${
              step >= 1 ? "bg-brand-purple" : "bg-gray-800"
            }`}
          />
          <div
            className={`h-1 flex-1 rounded-full transition-colors ${
              step >= 2 ? "bg-brand-purple" : "bg-gray-800"
            }`}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 flex-1 space-y-4">
          {step === 1 ? (
            <>
              {/* Agency Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-400">
                  Nombre de la Agencia
                </label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={formData.agencyName}
                    onChange={(e) =>
                      setFormData({ ...formData, agencyName: e.target.value })
                    }
                    placeholder="Mi Agencia de Talentos"
                    className="w-full rounded-xl bg-gray-900/80 border border-gray-800 py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple"
                  />
                </div>
              </div>

              {/* Contact Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-400">
                  Nombre del Contacto
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) =>
                      setFormData({ ...formData, contactName: e.target.value })
                    }
                    placeholder="Juan Pérez"
                    className="w-full rounded-xl bg-gray-900/80 border border-gray-800 py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-400">
                  Teléfono / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+52 55 1234 5678"
                    className="w-full rounded-xl bg-gray-900/80 border border-gray-800 py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple"
                  />
                </div>
              </div>

              {/* Creators Count */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-400">
                  ¿Cuántos creadores representas?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {creatorsOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, creatorsCount: option.value })
                      }
                      className={`flex items-center justify-center gap-2 rounded-xl border py-3 px-4 text-sm font-medium transition-all ${
                        formData.creatorsCount === option.value
                          ? "border-brand-purple bg-brand-purple/20 text-white"
                          : "border-gray-800 bg-gray-900/80 text-gray-400 hover:border-gray-700"
                      }`}
                    >
                      <Users className="h-4 w-4" />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
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

                {/* Password requirements */}
                <div className="mt-3 space-y-1">
                  {passwordRequirements.map((req, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 text-xs ${
                        req.met ? "text-green-500" : "text-gray-500"
                      }`}
                    >
                      <Check
                        className={`h-3 w-3 ${
                          req.met ? "opacity-100" : "opacity-30"
                        }`}
                      />
                      {req.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms */}
              <p className="text-xs text-gray-500 mt-4">
                Al registrarte, aceptas nuestros{" "}
                <Link href="/terms" className="text-brand-purple hover:underline">
                  Términos de Servicio
                </Link>{" "}
                y{" "}
                <Link href="/privacy" className="text-brand-purple hover:underline">
                  Política de Privacidad
                </Link>
              </p>
            </>
          )}
        </form>

        {/* Footer */}
        <div className="space-y-4 pb-6">
          {/* Continue/Submit button */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full rounded-full bg-gradient-to-r from-brand-purple to-brand-blue py-4 text-center font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-brand-purple/30 active:scale-[0.98]"
          >
            {step === 1 ? "Continuar" : "Crear Cuenta de Agencia"}
          </button>

          {/* Login link */}
          <p className="text-center text-sm text-gray-500">
            ¿Ya tienes cuenta de agencia?{" "}
            <Link
              href="/onboarding/agency/login"
              className="text-brand-purple hover:underline font-medium"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
