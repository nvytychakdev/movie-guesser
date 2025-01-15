"use client";
import { useAnimate } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useImageQualityStore } from "../stores/image-quality";
import { useMovieGuessStore } from "../stores/movie-game";

export default function GuessPreview() {
  const [scope, animate] = useAnimate();
  const [loading, setLoading] = useState(false);
  const width = useImageQualityStore((store) => store.width);
  const height = useImageQualityStore((store) => store.height);
  const gameMovie = useMovieGuessStore((state) => state.gameMovie);
  const index = useMovieGuessStore((state) => state.index);

  const src = gameMovie?.guess[index].image;

  useEffect(() => {
    setLoading(true);
    animate(scope.current, { opacity: 0 });
  }, [animate, scope, index]);

  return (
    <div className="relative flex items-center h-full w-full max-h-[85vh] overflow-hidden">
      {src ? (
        <Image
          ref={scope}
          className="object-contain rounded-lg max-h-full max-w-full w-full h-min"
          src={src}
          alt="Movie preview"
          width={width}
          height={height}
          onLoad={() => {
            setLoading(false);
            animate(scope.current, { opacity: 1 }, { duration: 1 });
          }}
        />
      ) : (
        <div>No image found</div>
      )}

      {loading && (
        <div className="absolute inline-block top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <LoaderCircle className="animate-spin" size="40px" />
        </div>
      )}
    </div>
  );
}
