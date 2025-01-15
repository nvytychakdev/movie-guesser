import { NextRequest } from "next/server";
import movies from "./movies.json";

export interface Movie {
  adult: string;
  belongs_to_collection: string;
  budget: string;
  genres: string;
  homepage: string;
  id: string;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: string;
  production_countries: string;
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: string;
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export const GET = (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search");
  const skip = Number(searchParams.get("skip"));
  const popularity = Number(searchParams.get("popularity")) ?? 0;
  const limit = Number(searchParams.get("limit")) || 20;

  const moviesList = moviesSearch(movies as Movie[], search);
  const data = moviesList
    .filter((movie) => movie.popularity > popularity)
    .splice(skip, limit)
    .sort((a, b) => {
      return (
        a.title
          .toLocaleLowerCase()
          .localeCompare(b.title.toLocaleLowerCase()) &&
        b.popularity - a.popularity
      );
    });

  return Response.json({ data });
};

function moviesSearch(movies: Movie[], search: string | null) {
  if (!search) return movies;
  return movies.filter((movie) =>
    movie.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
  );
}
