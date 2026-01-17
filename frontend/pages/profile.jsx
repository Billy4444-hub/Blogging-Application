const API_URL = import.meta.env.VITE_API_URL;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/profile", {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (err) {
        navigate("/login");
      }
    };

    fetchProfile();
  }, []);

  // Logout
  const handleLogout = async () => {
    await axios.get("/api/logout", { withCredentials: true });
    navigate("/login");
  };

  // Add new post
  const handlePost = async (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    const res = await axios.post(
      "/api/post",
      { content },
      { withCredentials: true }
    );

    setUser((prev) => ({
      ...prev,
      post: [...prev.post, res.data.post],
    }));

    setContent("");
  };

  // Like / Unlike
  const handleLike = async (postId) => {
    const res = await axios.post(`/api/like/${postId}`, {
      withCredentials: true,
    });

    setUser((prev) => ({
      ...prev,
      post: prev.post.map((p) =>
        p._id === postId
          ? {
              ...p,
              likes: res.data.liked
                ? [...p.likes, prev._id]
                : p.likes.filter((id) => id !== prev._id),
            }
          : p
      ),
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-zinc-900 text-white px-6 py-8">

      {/* Logout */}
      <div className="flex justify-end mb-10">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-md text-sm"
        >
          Logout
        </button>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center mb-14 text-center">
        <div className="w-24 h-24 rounded-full overflow-hidden border border-zinc-700 shadow-md">
          <img
            src={
              user?.profilePic
                ? `${API_URL}${user.profilePic}`
                : `${API_URL}/static/default.png`
            }
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>

        <button
          onClick={() => navigate("/profileupload")}
          className="mt-3 text-sm bg-blue-600 hover:bg-blue-700 transition px-4 py-1.5 rounded-md"
        >
          Upload Profile Picture
        </button>

        <h3 className="text-3xl font-semibold mt-4">
          Hello, <span className="text-green-500">{user.name}</span> 👋
        </h3>
      </div>

      {/* Add Post Section */}
      <div className="flex flex-col items-center mb-20">
        <h5 className="mb-4 text-lg text-zinc-400">Add new post</h5>

        <form onSubmit={handlePost} className="w-full max-w-md flex flex-col">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind..."
            className="resize-none bg-transparent border border-zinc-700 rounded-lg p-3 outline-none text-sm focus:border-blue-600 transition"
            rows="4"
          />

          <button
            type="submit"
            className="mt-3 self-center bg-blue-600 hover:bg-blue-700 transition px-6 py-2 rounded-md"
          >
            Add
          </button>
        </form>
      </div>

      {/* Posts Section */}
      <div>
        <h3 className="text-zinc-400 mb-6 text-center">Your Posts...</h3>

        <div className="flex flex-wrap justify-center gap-6">
          {[...user.post].reverse().map((post) => (
            <div
              key={post._id}
              className="bg-zinc-800 p-4 rounded-xl w-full max-w-sm shadow-md"
            >
              <h4 className="text-blue-500 mb-2 text-sm">
                {user.email}
              </h4>

              <p className="text-sm text-zinc-200">
                {post.content}
              </p>

              <small className="block mt-2 text-zinc-400">
                {post.likes.length} likes
              </small>

              <div className="flex gap-4 mt-3">
                <button
                  onClick={() => handleLike(post._id)}
                  className="text-blue-500 hover:underline text-sm"
                >
                  {post.likes.includes(user._id) ? "Unlike" : "Like"}
                </button>

                <button
                  onClick={() => navigate(`/edit/${post._id}`)}
                  className="text-zinc-400 hover:underline text-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Profile;
