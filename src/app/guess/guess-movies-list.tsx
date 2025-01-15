"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { Movie } from "../api/movies/route";
import { useMovieGuessStore } from "../stores/movie-game";

export type MovieOption = { label: string; value: string };
type GuessMoviesListProps = {
  movie: MovieOption | null;
  onMovieSelect: (movie: MovieOption | null) => void;
};

export function GuessMoviesList(props: GuessMoviesListProps) {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [moviesList, setMovies] = useState<Movie[]>([]);
  const attempts = useMovieGuessStore((store) => store.attempts);

  const movies = moviesList
    .filter((movie) => {
      if (!attempts.length) return true;
      return !attempts.find(
        (a) => a.status === "fail" && a.value === movie.imdb_id,
      );
    })
    .map<MovieOption>((movie) => {
      const date =
        typeof movie.release_date === "string"
          ? ` (${movie.release_date?.split("-").at(0)})`
          : "";

      return {
        label: `${movie.title.trim()}${date}`,
        value: movie.imdb_id.trim(),
      };
    });

  useEffect(() => {
    const abortCtrl = new AbortController();
    async function fetchMovies() {
      setLoading(true);
      const api = "/api/movies?skip=0&limit=20&popularity=5";
      try {
        const response = await fetch(search ? `${api}&search=${search}` : api, {
          signal: abortCtrl.signal,
        });
        const { data } = (await response.json()) as { data: Movie[] };
        setMovies(data);
      } catch (error) {}
      setLoading(false);
    }
    try {
      fetchMovies();
    } catch (error) {}
    return () => abortCtrl.abort("Component destroyed");
  }, [search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            {props.movie ? props.movie?.label : "Select movie..."}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" className="w-[300px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            onValueChange={(value) => setSearch(value)}
            placeholder="Search movie..."
          />
          <CommandList>
            {loading && !movies.length ? (
              <div className="p-2 flex flex-col gap-3">
                <Skeleton className="h-7 w-full" />
                <Skeleton className="h-7 w-full" />
                <Skeleton className="h-7 w-full" />
              </div>
            ) : (
              <>
                <CommandEmpty>No movies found.</CommandEmpty>
              </>
            )}

            <CommandGroup>
              {movies.map((movie) => (
                <CommandItem
                  className="flex justify-between"
                  key={movie.value}
                  value={movie.value}
                  onSelect={(currentValue) => {
                    const movie = movies.find(
                      (movie) => movie.value === currentValue,
                    );
                    props.onMovieSelect(movie || null);
                    setOpen(false);
                  }}
                >
                  {movie.label}
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      props.movie?.value === movie.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
