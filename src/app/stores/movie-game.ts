import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { MovieGuess } from "../api/movies/[id]/route";

export type MovieGameAttempt =
  | {
      label: string;
      value: string;
      status: "fail" | "success";
    }
  | { status: "skip" };

interface MovieGameState {
  loading: boolean;
  index: number;
  highestIndex: number;
  limit: number;
  movieId?: string;
  gameMovie: MovieGuess | null;
  attempts: MovieGameAttempt[];
  status: "pending" | "inprogress" | "fail" | "success";
}

interface MovieGameActions {
  skip: () => void;
  submit: (movie: { label: string; value: string }) => void;
  next: () => void;
  previous: () => void;
  setIndex: (index: number) => void;
  startLoading: () => void;
  initializeGame: (game: MovieGuess) => void;
  setMovieId: (movieId: string) => void;
  reset: () => void;
}

const initialState: MovieGameState = {
  loading: true,
  index: 0,
  highestIndex: 0,
  limit: 7,
  gameMovie: null,
  movieId: undefined,
  attempts: [],
  status: "pending",
};

// TODO: remove devtools
export const useMovieGuessStore = create(
  devtools<MovieGameState & MovieGameActions>((set) => ({
    ...initialState,
    skip: () =>
      set((state) => {
        // no game exists, skip submission
        if (!state.gameMovie) return {};
        // completed games should not accept guesses anymore
        if (state.status === "fail" || state.status === "success") return {};

        const attempt: MovieGameAttempt = { status: "skip" };

        // user still has guesses
        if (state.index < state.limit - 1) {
          const nextIndex = state.highestIndex + 1;
          return {
            index: nextIndex,
            highestIndex: nextIndex,
            attempts: [attempt, ...state.attempts],
          };
        }

        // this was last guess, fail the game
        return {
          status: "fail",
          attempts: [attempt, ...state.attempts],
        };
      }),
    submit: (movie) =>
      set((state) => {
        // no game exists, skip submission
        if (!state.gameMovie) return {};
        // completed games should not accept guesses anymore
        if (state.status === "fail" || state.status === "success") return {};

        // successful guess
        if (state.gameMovie.movie.imdb_id === movie.value) {
          // allow traversing between full list of the screenshots
          const attempt: MovieGameAttempt = { ...movie, status: "success" };
          return {
            index: state.limit - 1,
            highestIndex: state.limit - 1,
            status: "success",
            attempts: [attempt, ...state.attempts],
          };
        }

        // wrong guess
        if (state.gameMovie.movie.imdb_id !== movie.value) {
          const attempt: MovieGameAttempt = { ...movie, status: "fail" };

          // user still has guesses
          if (state.index < state.limit - 1) {
            const nextIndex = state.highestIndex + 1;
            return {
              index: nextIndex,
              highestIndex: nextIndex,
              attempts: [attempt, ...state.attempts],
            };
          }

          // this was last guess, fail the game
          return {
            status: "fail",
            attempts: [attempt, ...state.attempts],
          };
        }

        return {};
      }),
    next: () =>
      set((state) => {
        const nextIndex = state.index + 1;
        if (nextIndex > state.highestIndex) return {};
        return { index: nextIndex };
      }),
    previous: () =>
      set((state) => {
        const prevIndex = state.index - 1;
        if (prevIndex < 0) return {};
        return { index: prevIndex };
      }),
    setIndex: (index: number) =>
      set((state) => {
        if (index > state.highestIndex || index > state.limit || index < 0) {
          return {};
        }

        return { index };
      }),
    startLoading: () => set({ loading: true }),
    initializeGame: (game: MovieGuess) =>
      set({
        loading: false,
        gameMovie: game,
        limit: Math.min(game.guess.length || 0, 7),
      }),
    setMovieId: (movieId: string) => set({ ...initialState, movieId }),
    reset: () => set(initialState),
  })),
);
