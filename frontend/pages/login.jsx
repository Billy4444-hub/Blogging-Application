import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
     await axios.post(
      "/api/login",
      {
        email: e.target.email.value,
        password: e.target.password.value,
      },
      { withCredentials: true }
    );

    navigate("/profile");

  } catch (err) {
    alert(err.response.data.message);
  }
};

  return (
    <div className="w-full min-h-screen bg-zinc-900 p-10 text-white flex items-center justify-center">
      <div className="w-full max-w-md">
        
        <h3 className="text-3xl mb-6 font-semibold">
          Login Your Account
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="px-3 py-2 rounded-md bg-transparent text-white border-2 border-zinc-800 focus:outline-none focus:border-blue-600"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="px-3 py-2 rounded-md bg-transparent text-white border-2 border-zinc-800 focus:outline-none focus:border-blue-600"
          />

          <button
            type="submit"
            className="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition cursor-pointer font-medium"
          >
            Login
          </button>
        </form>

      </div>
    </div>
  );
}

export default Login;
