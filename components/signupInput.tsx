
"use client";

import { useState } from "react";
import { Eye, EyeOff, Target, UserRound, LockKeyhole } from "lucide-react";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";

export function SignupInput() {

  const router = useRouter()

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [goal, setGoal] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    
    try {
      const responce = await api.post("/api/adduser", {
        username, password, goal
      })
    

      if( responce.status === 201 ) {
        setUsername("")
        setPassword("")
        router.push("/login");
        return
      }
    } catch (error: any) {
    
      
      setError(error.response?.data?.message || "Login failed. Please try again.");
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex items-center justify-center bg-white px-4 py-10 text-black">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">

        <form onSubmit={handleSignup} className="space-y-5">
          
        {/* Username */}
        <div>
        <label
            htmlFor="username"
            className="mb-2 block text-sm font-semibold"
        >
            Username
        </label>

        <div className="flex items-center gap-3 rounded-xl border border-gray-300 px-4 transition focus-within:border-black focus-within:ring-1 focus-within:ring-black">
            <UserRound size={19} className="shrink-0 text-gray-500" />

            <div className="flex items-center">
                <span className="select-none text-sm text-gray-500">@</span>

                <input
                id="username"
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) =>
                    setUsername(e.target.value.replace(/^@+/, ""))
                }
                autoComplete="username"
                required
                className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-gray-400"
                />

            </div>
        </div>
        </div>


          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold"
            >
              Password
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-gray-300 px-4 transition focus-within:border-black focus-within:ring-1 focus-within:ring-black">
              <LockKeyhole size={19} className="text-gray-500" />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-gray-400"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-gray-500 hover:text-black"
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          {/* Goal */}
          <div>
            <label
              htmlFor="goal"
              className="mb-2 block text-sm font-semibold"
            >
              Goal
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-gray-300 px-4 transition focus-within:border-black focus-within:ring-1 focus-within:ring-black">
              <Target size={19} className="shrink-0 text-gray-500" />
                
                <input
                id="goal"
                type="text"
                placeholder="goal"
                value={goal}
                onChange={(e) =>
                    setGoal(e.target.value)
                }
                autoComplete="username"
                required
                className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-gray-400"
                />
              
            </div>
          </div>

          {/* Login button */}
          <button
          disabled={loading}
            type="submit"
            className="w-full rounded-xl bg-black py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.99]"
          >
            Create Account
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-sm text-gray-400">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <p className="text-center text-sm text-gray-500">
          genrate token |{" "}
          <a
            href="/login"
            className="font-semibold text-black underline underline-offset-4 hover:text-gray-600"
          >
            token
          </a>
        </p>
      </div>
    </main>
  );
}
function setError(arg0: any) {
  throw new Error("Function not implemented.");
}

