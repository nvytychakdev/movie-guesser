// app/reference/route.js
import { ApiReference } from "@scalar/nextjs-api-reference";

const config = {
  spec: {
    content: "https://cdn.jsdelivr.net/npm/@scalar/galaxy/dist/latest.yaml",
  },
};

export const GET = ApiReference(config);
