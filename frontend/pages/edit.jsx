import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditPost = () => {
  const { id } = useParams(); // post id
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch existing post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/post/${id}`, {
          withCredentials: true,
        });
        setContent(res.data.content);
        setLoading(false);
      } catch (err) {
        navigate("/profile");
      }
    };

    fetchPost();
  }, [id, navigate]);

  // Update post
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("Post content cannot be empty");
      return;
    }

    try {
      await axios.post(
        `/api/update/${id}`,
        { content },
        { withCredentials: true }
      );

      navigate("/profile");
    } catch (err) {
      alert("Failed to update post");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
        <p className="text-zinc-400 animate-pulse">Loading post...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-zinc-900 text-white flex items-center justify-center px-6">
      
      <div className="w-full max-w-md bg-zinc-800/40 border border-zinc-700 rounded-2xl p-8 shadow-lg">
        
        <h3 className="text-2xl font-semibold mb-2 text-center">
          Edit Your Post
        </h3>
        <p className="text-sm text-zinc-400 text-center mb-6">
          Update your content and share your thoughts
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="resize-none bg-transparent border border-zinc-700 rounded-lg p-3 outline-none w-full focus:border-yellow-500 transition"
            placeholder="Update your post..."
          />

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 transition font-medium text-white"
          >
            Update Post
          </button>

          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="w-full py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition text-sm text-white"
          >
            Cancel
          </button>
        </form>

      </div>
    </div>
  );
};

export default EditPost;
