require("dotenv").config();
const request = require("supertest");
const app = require("../config/appConfig");

describe("Redirect routes", () => {
  it("should redirect / to /login", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toEqual(302);
    expect(response.header.location).toEqual("/login");
  });

  it("should redirect /index to /login", async () => {
    const response = await request(app).get("/index");
    expect(response.statusCode).toEqual(302);
    expect(response.header.location).toEqual("/login");
  });
});

describe("/index/:room test", () => {
  it("should redirect to login if no session is set", async () => {
    const response = await request(app).get("/index/someRoom");
    expect(response.statusCode).toEqual(302);
    expect(response.header.location).toEqual("/login");
  });
  //An integration test with cookies and sessions is needed
});

describe("/login test", () => {
  it("should send an HTML file on GET request", async () => {
    const response = await request(app).get("/login");
    expect(response.statusCode).toEqual(200);
    expect(response.text).toContain("<!DOCTYPE html>");
  });

  it("should redirect on successful POST request", async () => {
    let data = {
      username: "user",
      room: "someRoom",
    };
    const response = await request(app)
      .post("/login")
      .send(data)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(302);
    expect(response.header.location).toEqual(`/index/${data.room}`);
  });

});
