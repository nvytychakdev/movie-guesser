import { NextRequest } from "next/server";
import movies from "../movies.json";
import { Movie } from "../route";

export interface MovieNext {
  total: number;
  index: number;
  movie: string;
  nextIndex: number;
  nextMovie: string;
}

export const GET = (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const index = Number(searchParams.get("index") ?? 0);

  const moviesList = movies as Movie[];
  const data = moviesList.toSorted((a, b) => {
    return b.popularity - a.popularity;
  });

  const response = {
    total: moviesList.length,
    index,
    movie: data[index],
  };

  if (!data[index]) {
    return Response.json(
      { message: "No movie exists by this index" },
      { status: 400 },
    );
  }

  if (!data[index + 1]) {
    return Response.json({ ...response });
  }

  return Response.json({
    ...response,
    nextIndex: index + 1,
    nextMovie: data[index + 1].imdb_id,
  });
};
