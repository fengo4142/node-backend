import server from "../../src/server";
import db from "../../src/db";

import { instance } from "../config";

beforeAll(async () => {
  await db.migrate.latest();
  await db.seed.run();
  await server.start();
});

afterAll(async () => {
  await server.stop();
  await db.destroy();
});

describe("API methods", () => {
  it("tries health checking", async () => {
    const { status } = await instance.get("/api/health-check/");

    expect(status).toBe(200);
  });
});
