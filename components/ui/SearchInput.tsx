"use client";

import { Search, MapPin, Sparkles } from "lucide-react";
import { useState } from "react";

export default function SearchInput() {
  const [value, setValue] = useState("");

  return (
    <div className="relative w-full max-w-xl mx-auto group">
      <div
        className="
          absolute
          inset-0
          rounded-3xl
          bg-gradient-to-r
          from-purple-400
          via-fuchsia-400
          to-orange-300
          blur-xl
          opacity-40
          group-hover:opacity-70
          transition
        "
      />

      <div
        className="
          relative
          flex
          items-center
          gap-4
          rounded-3xl
          bg-white/40
          backdrop-blur-2xl
          border
          border-white/50
          px-6
          py-5
          shadow-xl
          transition-all
          duration-300
          focus-within:bg-white/60
        "
      >
        <div
          className="
            flex
            items-center
            justify-center
            h-12
            w-12
            rounded-2xl
            bg-purple-950
            text-white
            shadow-lg
          "
        >
          <Search size={22} />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Rechercher une ville..."
          className="
            flex-1
            bg-transparent
            outline-none
            text-lg
            text-purple-950
            placeholder:text-purple-900/50
          "
        />
        <div
          className="
            hidden
            md:flex
            items-center
            gap-1
            rounded-full
            bg-white/50
            px-4
            py-2
            text-sm
            text-purple-800
          "
        >
          <Sparkles size={16} />
          IA
        </div>
      </div>
      <button
        className="
          absolute
          right-6
          -bottom-8
          flex
          items-center
          gap-2
          text-sm
          text-purple-900/70
          hover:text-purple-950
          transition
        "
      >
        <MapPin size={16} />
        Utiliser ma position
      </button>
    </div>
  );
}
