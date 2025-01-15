import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useMovieGuessStore } from "../stores/movie-game";
import { GuessMoviesList, MovieOption } from "./guess-movies-list";

interface GuessControlsProps {
  onNextMovie: () => void;
}

export default function GuessControls({ onNextMovie }: GuessControlsProps) {
  const [movie, setMovie] = useState<MovieOption | null>(null);
  const index = useMovieGuessStore((state) => state.index);
  const highestIndex = useMovieGuessStore((state) => state.highestIndex);
  const status = useMovieGuessStore((state) => state.status);
  const submit = useMovieGuessStore((state) => state.submit);
  const previous = useMovieGuessStore((state) => state.previous);
  const next = useMovieGuessStore((state) => state.next);
  const skip = useMovieGuessStore((state) => state.skip);

  const completed = status === "fail" || status === "success";

  return (
    <section className="flex gap-2 items-center">
      <Button
        disabled={index <= 0}
        variant="secondary"
        size="icon"
        onClick={() => previous()}
      >
        <ChevronLeft />
      </Button>
      <Button
        disabled={index >= highestIndex}
        variant="secondary"
        size="icon"
        onClick={() => next()}
      >
        <ChevronRight />
      </Button>
      {!completed ? (
        <>
          <GuessMoviesList movie={movie} onMovieSelect={setMovie} />
          <Button
            onClick={() => {
              movie && submit(movie);
              setMovie(null);
            }}
            disabled={completed || !movie}
          >
            Submit
          </Button>
          <Button onClick={() => skip()} variant={"link"} disabled={completed}>
            Skip
          </Button>
        </>
      ) : (
        <Button onClick={() => onNextMovie()}>Next movie</Button>
      )}
    </section>
  );
}
