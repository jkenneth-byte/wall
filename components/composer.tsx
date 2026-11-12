"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ImageIcon, X } from "lucide-react";

export function Composer() {
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const maxLength = 280;

  const handleSubmit = async () => {
    if ((!content.trim() && !file) || content.length > maxLength) return;
    
    setIsSubmitting(true);
    setError("");
    let imageUrl = null;

    // 1. Upload image to Storage if one is selected
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload Error:", uploadError);
        setError("Failed to upload image.");
        setIsSubmitting(false);
        return;
      }

      // Get the public URL for the uploaded image
      const { data } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath);
      
      imageUrl = data.publicUrl;
    }

    // 2. Insert post with text and optional image URL
    const { error: dbError } = await supabase
      .from("posts")
      .insert([{ 
        content: content.trim(), 
        author_name: "Jess Kenneth Lacorte",
        image_url: imageUrl
      }]);

    if (dbError) {
      console.error("Database Error:", dbError);
      setError("Failed to post.");
    } else {
      setContent("");
      setFile(null);
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col space-y-3">
      <Textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="resize-none min-h-[100px] border-gray-300 focus-visible:ring-blue-500"
      />
      
      {/* File Preview */}
      {file && (
        <div className="relative w-max">
          <img 
            src={URL.createObjectURL(file)} 
            alt="Upload preview" 
            className="h-20 w-auto rounded-md object-cover border"
          />
          <button 
            onClick={() => setFile(null)}
            className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-1 hover:bg-gray-700"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className={`text-xs ${content.length > maxLength ? 'text-red-500' : 'text-gray-500'}`}>
            {maxLength - content.length} characters remaining
          </span>
          
          {/* Hidden File Input & Trigger */}
          <div className="relative">
            <Input 
              type="file" 
              accept="image/*" 
              id="image-upload"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <label 
              htmlFor="image-upload" 
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 cursor-pointer font-medium"
            >
              <ImageIcon size={18} />
              Photo
            </label>
          </div>
        </div>

        <div className="flex flex-col items-end">
          {error && <span className="text-xs text-red-500 mb-1">{error}</span>}
          <Button 
            onClick={handleSubmit} 
            disabled={(!content.trim() && !file) || content.length > maxLength || isSubmitting}
            className="bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 font-semibold px-6"
          >
            {isSubmitting ? "Sharing..." : "Share"}
          </Button>
        </div>
      </div>
    </div>
  );
}