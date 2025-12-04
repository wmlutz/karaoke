"use client";

import { useState, useEffect, ReactNode } from "react";

interface PasswordProtectionProps {
  children: ReactNode;
  pageName?: string;
}

export default function PasswordProtection({
  children,
  pageName = "default",
}: PasswordProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  // Check if already authenticated for this page on mount
  useEffect(() => {
    const authStatus = localStorage.getItem(`auth_${pageName}`);
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, [pageName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError("");

    try {
      const response = await fetch("/api/verify-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.valid) {
        localStorage.setItem(`auth_${pageName}`, "true");
        setIsAuthenticated(true);
      } else {
        setError("Incorrect password");
        setPassword("");
      }
    } catch (err) {
      console.error("Error verifying password:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-purple-900 via-purple-800 to-pink-800 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
          <h2
            className="text-2xl font-bold text-white mb-2 text-center"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Protected Page
          </h2>
          <p
            className="text-white/80 text-center mb-6"
            style={{ fontFamily: "var(--font-raleway)" }}
          >
            Enter the password to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              disabled={isVerifying}
              className="w-full px-6 py-4 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-pink-300 text-lg disabled:opacity-50"
              style={{ fontFamily: "var(--font-raleway)" }}
            />

            {error && (
              <p
                className="text-red-300 text-sm text-center"
                style={{ fontFamily: "var(--font-raleway)" }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-full transition-colors text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {isVerifying ? "Verifying..." : "Enter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
