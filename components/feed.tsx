"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";

type Post = {
  id: string;
  created_at: string;
  content: string;
  author_name: string;
  image_url?: string;
};

export function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch initial posts
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setPosts(data);
      setLoading(false);
    };

    fetchPosts();

    // 2. Subscribe to real-time inserts
    const channel = supabase
      .channel("realtime-posts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => {
          setPosts((current) => [payload.new as Post, ...current]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading)
    return (
      <div className="animate-pulse space-y-4 text-sm text-gray-500 mt-6">
        Loading feed...
      </div>
    );

return (
    <div className="mt-6 flex flex-col space-y-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="flex flex-col border-b pb-4 animate-in fade-in slide-in-from-bottom-2 duration-500"
        >
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-[15px]">{post.author_name}</span>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </span>
          </div>
          <p className="text-[14px] text-gray-800 break-words mb-2">
            {post.content}
          </p>

          {/* Render the image if it exists */}
          {post.image_url && (
            <img
              src={post.image_url}
              alt="Post attachment"
              className="max-w-full rounded-md border border-gray-200 max-h-[400px] object-contain bg-gray-50"
            />
          )}
        </div>
      ))}
    </div>
  );
}