import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UploadProfilePic = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      setLoading(true);

      await axios.post("/api/profileupload", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/profile");
    } catch (err) {
      alert("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-zinc-900 text-white flex items-center justify-center px-6">
      
      <div className="w-full max-w-md bg-zinc-800/40 border border-zinc-700 rounded-2xl p-8 shadow-lg">
        
        <h3 className="text-2xl font-semibold mb-2 text-center">
          Upload Profile Picture
        </h3>
        <p className="text-sm text-zinc-400 text-center mb-6">
          Choose a photo to personalize your profile
        </p>

        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          className="flex flex-col gap-5"
        >
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full px-4 py-2 rounded-lg bg-transparent text-white border border-zinc-700 focus:outline-none focus:border-blue-600 transition cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="w-full py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition text-sm"
          >
            Cancel
          </button>
        </form>

      </div>
    </div>
  );
};

export default UploadProfilePic;
