const io = require("socket.io-client");
const createSocketServer = require("../config/socketConfig");
const socketEvents = require("../config/socketEvents");

describe("Socket.io test", function () {
  let client1, client2;
  let httpServer;
  let serverIo;
  const room = "test-room";

  beforeAll((done) => {
    ({ httpServer, io: serverIo } = createSocketServer());
    socketEvents(serverIo);

    // Start the HTTP server
    httpServer.listen(() => {
      const port = httpServer.address().port;
      client1 = io(`http://localhost:${port}`);
      client2 = io(`http://localhost:${port}`);
      done();
    });
  });

  afterAll(() => {
    client1.close();
    client2.close();
    httpServer.close();
  });

  it("Should emit 'conn' event upon connection", (done) => {
    client1.on("conn", (data) => {
      console.log("Connected successfully");
      expect(data).toEqual({ conn: true });
      done();
    });
  });

  it("Should join a room successfully",  (done) => {
    client1.on("joined-room",(data)=>{
        console.log("client joined the room");
        expect(data).toEqual({room,user:"client2"})
        done();
    })
    client1.emit("enter-room", { room, user:"client1"});
    client2.emit("enter-room", { room, user:"client2" });
  });

  it("Should emit 'message' event correctly", (done) => {
    const message = "Hello, world!";
    const user = "test-user";
    const id = "test-id";

    client2.on("message", (data) => {
      console.log("client 1 sent a message");
      expect(data).toEqual({ message, user, id });
      done();
    });
    client1.emit("message", { message, user, id, room });
  });

  it("Should leave a room successfully", (done) => {
    client2.on("left-room",(data)=>{
        console.log("client left the room");
        expect(data).toEqual({room, user:"client1"});
        client2.emit("leave-room", { room, user:"client2" });
        done();
    })
    client1.emit("leave-room", { room, user:"client1" });
  });
});
