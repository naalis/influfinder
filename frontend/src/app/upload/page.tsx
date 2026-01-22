"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Image as ImageIcon,
  X,
  ArrowRight,
  Sparkles,
  Check,
  AlertCircle,
  Loader2,
  Upload as UploadIcon,
} from "lucide-react";

type VerificationStatus = "idle" | "verifying" | "success" | "warning" | "error";

interface VerificationResult {
  status: VerificationStatus;
  score: number;
  messages: string[];
}

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [verification, setVerification] = useState<VerificationResult>({
    status: "idle",
    score: 0,
    messages: [],
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        runAIVerification();
      };
      reader.readAsDataURL(file);
    }
  };

  const runAIVerification = () => {
    setVerification({ status: "verifying", score: 0, messages: [] });

    // Simulate AI verification
    setTimeout(() => {
      const score = Math.floor(Math.random() * 30) + 70; // 70-100
      const messages: string[] = [];

      if (score >= 90) {
        messages.push("Excellent image quality");
        messages.push("Brand elements clearly visible");
        messages.push("Authentic content detected");
      } else if (score >= 80) {
        messages.push("Good image quality");
        messages.push("Consider better lighting");
      } else {
        messages.push("Image meets minimum requirements");
        messages.push("Consider improving composition");
      }

      setVerification({
        status: score >= 80 ? "success" : "warning",
        score,
        messages,
      });
    }, 2500);
  };

  const handleUpload = () => {
    setIsUploading(true);

    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      router.push("/upload/success");
    }, 2000);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setVerification({ status: "idle", score: 0, messages: [] });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-black/95 p-4 backdrop-blur-lg">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 transition-colors hover:bg-gray-700"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white">Upload Content</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="mx-auto max-w-lg px-6 py-6">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {!selectedImage ? (
          /* Upload Options */
          <div className="space-y-4">
            {/* Instructions */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-cyan/20">
                <Camera className="h-10 w-10 text-brand-cyan" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-white">
                Share Your Experience
              </h2>
              <p className="text-gray-400">
                Upload photos from your collaboration to complete your submission
              </p>
            </div>

            {/* Upload Buttons */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-between rounded-2xl border-2 border-dashed border-brand-cyan/50 bg-brand-cyan/10 p-6 transition-all hover:border-brand-cyan hover:bg-brand-cyan/20"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-cyan/20">
                  <ImageIcon className="h-6 w-6 text-brand-cyan" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white">
                    Choose from Gallery
                  </div>
                  <div className="text-sm text-gray-400">
                    Select existing photos
                  </div>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-brand-cyan" />
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-between rounded-2xl border border-gray-800 bg-gray-900 p-6 transition-all hover:border-gray-700 hover:bg-gray-800"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white">Take a Photo</div>
                  <div className="text-sm text-gray-400">
                    Use your device camera
                  </div>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </button>

            {/* Guidelines */}
            <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
                <Sparkles className="h-5 w-5 text-brand-cyan" />
                Photo Guidelines
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
                  High quality, well-lit photos
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
                  Show the product or experience clearly
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
                  Authentic, unedited content preferred
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
                  Include brand elements when possible
                </li>
              </ul>
            </div>
          </div>
        ) : (
          /* Preview & Verification */
          <div className="space-y-6">
            {/* Image Preview */}
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={selectedImage}
                alt="Selected content"
                className="aspect-square w-full object-cover"
              />
              <button
                onClick={clearImage}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 backdrop-blur-sm transition-all hover:bg-black/90"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>

            {/* AI Verification Status */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-semibold text-white">
                  <Sparkles className="h-5 w-5 text-brand-cyan" />
                  AI Verification
                </h3>
                {verification.status === "verifying" && (
                  <span className="text-sm text-gray-400">Analyzing...</span>
                )}
              </div>

              {verification.status === "verifying" && (
                <div className="flex flex-col items-center py-8">
                  <Loader2 className="mb-4 h-12 w-12 animate-spin text-brand-cyan" />
                  <p className="text-gray-400">Verifying content authenticity...</p>
                </div>
              )}

              {(verification.status === "success" || verification.status === "warning") && (
                <div className="space-y-4">
                  {/* Score */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Quality Score</span>
                    <span
                      className={`text-2xl font-bold ${
                        verification.score >= 90
                          ? "text-green-400"
                          : verification.score >= 80
                          ? "text-brand-cyan"
                          : "text-yellow-400"
                      }`}
                    >
                      {verification.score}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        verification.score >= 90
                          ? "bg-green-400"
                          : verification.score >= 80
                          ? "bg-brand-cyan"
                          : "bg-yellow-400"
                      }`}
                      style={{ width: `${verification.score}%` }}
                    />
                  </div>

                  {/* Messages */}
                  <div className="space-y-2">
                    {verification.messages.map((message, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-400" />
                        <span className="text-gray-300">{message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {verification.status === "error" && (
                <div className="flex items-center gap-3 rounded-xl bg-red-500/10 p-4">
                  <AlertCircle className="h-6 w-6 text-red-400" />
                  <div>
                    <div className="font-semibold text-white">
                      Verification Failed
                    </div>
                    <div className="text-sm text-gray-400">
                      Please try a different image
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Upload Button */}
            {(verification.status === "success" || verification.status === "warning") && (
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-cyan px-8 py-4 font-semibold text-black transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadIcon className="h-5 w-5" />
                    Submit Content
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
