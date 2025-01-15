"use client";

import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { MovieGuess } from "../api/movies/[id]/route";
import { MovieNext } from "../api/movies/next/route";
import { Movie } from "../api/movies/route";
import { ImageQualitySelect } from "../components/image-quality-select";
import { useMovieGuessStore } from "../stores/movie-game";
import GuessAttempts from "./guess-attempts";
import GuessControls from "./guess-controls";
import GuessPreview from "./guess-preview";
import GuessProgress from "./guess-progress";

export default function Guess() {
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const [movie, setMovie] = useState<Movie | null>(null);

  const movieId = useMovieGuessStore((state) => state.movieId);
  const initializeGame = useMovieGuessStore((state) => state.initializeGame);
  const startLoading = useMovieGuessStore((state) => state.startLoading);
  const loading = useMovieGuessStore((state) => state.loading);
  const attempts = useMovieGuessStore((state) => state.attempts);
  const setMovieId = useMovieGuessStore((state) => state.setMovieId);

  useEffect(() => {
    const abortCtrl = new AbortController();

    async function fetchMovie() {
      startLoading();

      const api = `/api/movies/next?index=${index}`;

      try {
        const response = await fetch(api, { signal: abortCtrl.signal });
        const data = (await response.json()) as MovieNext;
        setMovieId(data.nextMovie);
        setTotal(data.total);
      } catch (error) {}

      return () => abortCtrl.abort("Component destroyed");
    }
    fetchMovie();
  }, [startLoading, setMovieId, index]);

  useEffect(() => {
    if (!movieId) return;

    const abortCtrl = new AbortController();
    async function fetchMovie() {
      startLoading();

      const api = `/api/movies/${movieId}`;

      try {
        const response = await fetch(api, { signal: abortCtrl.signal });
        const data = (await response.json()) as MovieGuess;
        initializeGame(data);
        setMovie(data.movie);
      } catch (error) {}
    }
    fetchMovie();
    return () => abortCtrl.abort("Component destroyed");
  }, [startLoading, initializeGame, movieId]);

  return (
    <main className="min-h-screen bg-background relative flex flex-col justify-center items-center">
      {loading ? (
        <LoaderCircle className="animate-spin" size="40px" />
      ) : (
        <>
          <section className="absolute top-6 right-6 flex gap-4 items-center">
            {index} / {total}
            <ImageQualitySelect />
          </section>
          <section className="h-[75vh] xl:h-[85vh] relative flex items-center px-4 py-8 md:px-8 md:py-10 xl:px-24 xl:py-16">
            <GuessPreview />
          </section>
          <section className="flex gap-2 items-center flex-col absolute bottom-10 p-8 bg-background rounded-lg bg-opacity-50 backdrop-blur-md">
            {!!attempts.length && <GuessAttempts attempts={attempts} />}
            <GuessProgress movie={movie} />
            <GuessControls onNextMovie={() => setIndex(index + 1)} />
          </section>
        </>
      )}
    </main>
  );
}
