import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      await axios.post(
      `${import.meta.env.VITE_API_URL}/api/register`,
      {
        username: e.target.username.value,
        name: e.target.name.value,
        email: e.target.email.value,
        password: e.target.password.value,
        age: e.target.age.value,
      },
      { withCredentials: true }
    );
    navigate("/login");
    }
    catch(err){
      alert(err.response.data.message);
    }
  }
  return (
    <div className="w-full h-screen bg-zinc-900 p-10 text-white">
      <h3 className="text-3xl mb-3">Create Account</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="px-3 py-2 rounded-md bg-transparent text-white border-2 border-zinc-800 outline-none"
        />

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="px-3 py-2 rounded-md bg-transparent text-white border-2 border-zinc-800 outline-none"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="px-3 py-2 rounded-md bg-transparent text-white border-2 border-zinc-800 outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="px-3 py-2 rounded-md bg-transparent text-white border-2 border-zinc-800 outline-none"
        />

        <input
          type="number"
          name="age"
          placeholder="Age"
          className="px-3 py-2 rounded-md bg-transparent text-white border-2 border-zinc-800 outline-none"
        />

        <button
            type="submit"
            className="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition cursor-pointer font-medium"
          >
            Register
          </button>
      </form>
    </div>
  );
};

export default Register;
