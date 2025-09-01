import { http, HttpResponse } from "msw";
import { faker } from "@faker-js/faker";
import logSymbols from "log-symbols";
import chalk from "chalk";
import type { Email } from "@/utils/types";

export const handlers = [
  // Intercept "GET https://example.com/user" requests...
  http.get("https://example.com/user", () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json({
      id: "c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d",
      firstName: "John",
      lastName: "Maverick",
    });
  }),
  http.post("https://api.resend.com/emails", async ({ request }) => {
    const body = (await request.json()) as Email;
    console.log(
      chalk.green(`${logSymbols.info} Mocked email contents: `),
      body,
    );
    return HttpResponse.json({
      id: faker.string.uuid(),
      from: body.from,
      to: body.to,
      createdAt: new Date().toISOString(),
    });
  }),
];
