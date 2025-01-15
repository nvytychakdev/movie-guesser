import { Button } from "@/components/ui/button";
import { Film } from "lucide-react";
import { Movie } from "../api/movies/route";
import { useMovieGuessStore } from "../stores/movie-game";

const colorsMap = {
  fail: "bg-red-800 hover:bg-red-700 hover:bg-opacity-50 bg-opacity-25 border-red-400 border-opacity-20",
  success:
    "bg-emerald-700 hover:bg-emerald-600 hover:bg-opacity-75 bg-opacity-50 border-emerald-400 border-opacity-40",
  skip: "bg-gray-700 hover:bg-gray-600 hover:bg-opacity-75 bg-opacity-50 border-gray-400 border-opacity-40",
};

interface GuessProgressProps {
  movie: Movie | null;
}

export default function GuessProgress(props: GuessProgressProps) {
  const attempts = useMovieGuessStore((state) => state.attempts).toReversed();
  const status = useMovieGuessStore((state) => state.status);
  const limit = useMovieGuessStore((state) => state.limit);
  const index = useMovieGuessStore((state) => state.index);
  const highestIndex = useMovieGuessStore((state) => state.highestIndex);
  const setIndex = useMovieGuessStore((state) => state.setIndex);

  const fail = status === "fail";
  const success = status === "success";
  const completed = success || fail;

  const answer = completed && (
    <span className="flex gap-2 items-center">
      <a
        target="_blank"
        href={"https://m.imdb.com/title/" + props.movie?.imdb_id}
      >
        <Button variant="link" className="flex gap-2">
          <Film size="small" /> {props.movie?.title} (
          {props.movie?.release_date.split("-").at(0)})
        </Button>
      </a>
    </span>
  );

  return (
    <div className="flex flex-col items-center gap-2">
      {answer}
      <section className="flex gap-2">
        {new Array(limit).fill(null).map((value, i) => {
          const attempt = attempts[i];
          const color = attempt ? colorsMap[attempt.status] : "";

          return (
            <Button
              variant={index === i ? "default" : "outline"}
              key={i}
              disabled={i > highestIndex}
              onClick={() => setIndex(i)}
              className={index !== i ? color : ""}
            >
              {i + 1}
            </Button>
          );
        })}
      </section>
    </div>
  );
}
