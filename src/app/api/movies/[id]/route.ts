import * as cheerio from "cheerio";
import { NextRequest } from "next/server";
import movies from "../movies.json";
import { Movie } from "../route";

export interface MovieGuess {
  guess: { image: string }[];
  movie: Movie;
}

interface RouteParams<T> {
  params: T;
}

const IMAGE_QUALITY = {
  "0": "UX2048",
  "1": "QL50",
  "2": "UX182_CR0,0,182,268_AL__QL50",
  "3": "UX148_CR0,0,148,216_AL__QL50",
  "4": "UX86_CR0,0,86,86_AL_",
  "5": "UY99_CR43,0,99,99_AL_",
  "6": "UX32_CR0,0,32,44_AL_",
};

export const GET = async (
  request: NextRequest,
  { params }: RouteParams<{ id: string }>,
) => {
  const movie = (movies as Movie[]).find((m) => m.imdb_id === params.id);

  if (!movie) {
    return Response.json({ message: "No movie found." }, { status: 400 });
  }

  const response = await fetch(
    `https://m.imdb.com/title/${params.id}/mediaindex/?contentTypes=still_frame`,
  );

  const data = await response.text();
  const $ = cheerio.load(data);
  const images = $("[data-testid='section-images'] img.ipc-image")
    .map((i, x) => $(x).attr("src"))
    .toArray();

  const movieImages = images
    // filter out only movie related images
    .filter((url) => url.includes("/images/M/") && url.includes(".jpg"))
    // `FMjpg_UX2048` stands for High Res image from IMDB
    .map((url) => url.replace(/_V1_.*.jpg$/g, `_V1_${IMAGE_QUALITY[1]}.jpg`))
    // shuffled response
    .sort(() => 0.5 - Math.random());

  // const publicDir = `assets/${movie.imdb_id}`;
  // const guess = filenames.map((name) => ({ image: `/${publicDir}/${name}` }));
  const guess = movieImages.map((url) => ({ image: url }));

  return Response.json({
    guess,
    movie,
  });
};
