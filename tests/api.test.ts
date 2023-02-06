import request from "supertest";
import app from "../src/app";

describe("GET /api", () => {
    it("should return 200 OK", async() => {
        await request(app).get("/api/v1")
            .expect(200);
            expect((res: request.Response) => (res.body).toHaveProperty('_csrf'));
    });
});
