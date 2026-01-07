import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/") {
    return (
      <div className="min-h-screen w-full bg-zinc-900 text-white flex flex-col overflow-hidden">

        {/* Navbar */}
        <nav className="flex items-center justify-between px-10 py-6 animate-fade-in">
          {/* Logo */}
          <h1 className="text-2xl font-bold tracking-wide cursor-pointer">
            <span className="text-green-500">Blog</span>Sphere
          </h1>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition-all duration-300"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition-all duration-300 font-medium"
            >
              Register
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="flex flex-1 items-center justify-center px-6">
          <div className="max-w-4xl text-center animate-slide-up">

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl font-bold mb-8">
              Welcome to{" "}
              <span className="text-green-500">BlogSphere</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed mb-12">
              Share your thoughts and ideas.<br />
              Read amazing blogs from creators.<br />
              Connect with writers worldwide.
            </p>

          </div>
        </main>
      </div>
    );
  }

  return <Outlet />;
}

export default App;
