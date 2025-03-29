import React, { useState, useEffect } from "react";
import { supabase } from "./SupabaseClient.jsx";

const SignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [canSubmit, setCanSubmit] = useState(true);
  const [cooldownTimer, setCooldownTimer] = useState(0);

  useEffect(() => {
    let timer;
    if (cooldownTimer > 0) {
      timer = setTimeout(() => {
        setCooldownTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanSubmit(true);
    }
    return () => clearTimeout(timer);
  }, [cooldownTimer]);

  // Email validation function
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Function to upsert user record in the "users" table
  const upsertUser = async (userId, userData) => {
    try {
      // Ensure user agrees to terms
      if (!agreeTerms) {
        throw new Error(
          "Please agree to the Terms of Service and Privacy Policy"
        );
      }

      // Use supabase client with authentication
      const { data, error } = await supabase.from("users").upsert(
        {
          id: userId,
          ...userData,
        },
        {
          onConflict: "id",
          returning: "minimal", // Avoid returning unnecessary data
        }
      );

      if (error) {
        console.error("Detailed Upsert Error:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Upsert Error:", error);
      throw new Error(`User registration failed: ${error.message}`);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canSubmit) {
      setError(`Please wait ${cooldownTimer} seconds before trying again`);
      return;
    }

    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role,
          },
        },
      });

      if (authError) throw authError;

      // Important: Wait for session to be established
      if (authData.session) {
        // Set the session in the client
        await supabase.auth.setSession({
          access_token: authData.session.access_token,
          refresh_token: authData.session.refresh_token,
        });

        // Now upsert with established session
        const userId = authData.user.id;
        await upsertUser(userId, {
          name,
          email,
          role,
        });

        setSuccess(true);
      } else {
        // Handle email confirmation case
        setSuccess(true);
        setError("Please verify your email before signing in.");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      setError(
        error.message || "An unexpected error occurred. Please try again."
      );
      setCanSubmit(false);
      setCooldownTimer(60);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mt-24">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-600">Sign up to get started</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            Account created successfully! Please sign in to continue.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your full name"
              required
              disabled={loading || success || !canSubmit}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="your@email.com"
              required
              disabled={loading || success || !canSubmit}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              What best describes you?
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={loading || success || !canSubmit}
            >
              <option value="" disabled>
                Select your role
              </option>
              <option value="editor">Editor</option>
              <option value="graphic_designer">Graphic Designer</option>
              <option value="content_creator">Content Creator</option>
              <option value="web_designer">Web Designer</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              required
              disabled={loading || success || !canSubmit}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              required
              disabled={loading || success || !canSubmit}
            />
          </div>

          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              required
              disabled={loading || success || !canSubmit}
            />
            <label
              htmlFor="agreeTerms"
              className="ml-2 block text-sm text-gray-700"
            >
              I agree to the{" "}
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Privacy Policy
              </a>
            </label>
          </div>

          <button
            type="submit"
            className={`w-full ${
              !canSubmit ? "bg-gray-400" : "bg-blue-600"
            } text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors`}
            disabled={loading || success || !canSubmit}
          >
            {!canSubmit
              ? `Try Again in ${cooldownTimer}s`
              : loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/signin"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
