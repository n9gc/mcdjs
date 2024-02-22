import "@jest/globals";
import path from "path";
import { fileURLToPath } from "url";
import { hashGlobGit, hashGlobXxhash } from "../index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function sortObject(unordered) {
  return Object.keys(unordered)
    .sort()
    .reduce((obj, key) => {
      obj[key] = unordered[key];
      return obj;
    }, {});
}

describe("hash glob xxhash", () => {
  it("should calculate the hash in parallel consistently", () => {
    const map = hashGlobXxhash(["a.*"], {
      cwd: path.join(__dirname, "fixtures"),
      concurrency: 200,
    });

    expect(sortObject(map)).toMatchInlineSnapshot(`
{
  "a.json": 11810798349410098695n,
  "a.png": 4573747350076585403n,
  "a.txt": 13554666155361377856n,
}
`);
  });

  it("should calculate the hash of both positive and negative match globs", () => {
    const map = hashGlobXxhash(["*.*", "!b.*"], {
      cwd: path.join(__dirname, "fixtures"),
      concurrency: 200,
    });

    expect(sortObject(map)).toMatchInlineSnapshot(`
{
  ".hiddenfile": 9323281055126355666n,
  "a.json": 11810798349410098695n,
  "a.png": 4573747350076585403n,
  "a.txt": 13554666155361377856n,
}
`);
  });

  it("should calculate the hash of dot files", () => {
    const map = hashGlobXxhash([], {
      cwd: path.join(__dirname, "fixtures"),
      concurrency: 200,
    });

    expect(sortObject(map)).toMatchInlineSnapshot(`
{
  ".hiddenfile": 9323281055126355666n,
  "a.json": 11810798349410098695n,
  "a.png": 4573747350076585403n,
  "a.txt": 13554666155361377856n,
  "b.txt": 11083092647103983954n,
}
`);
  });
});

describe("hash glob git hash", () => {
  it("should calculate the hash in parallel consistently", () => {
    const map = hashGlobGit(["a.*"], {
      cwd: path.join(__dirname, "fixtures"),
      concurrency: 200,
    });

    expect(sortObject(map)).toMatchInlineSnapshot(`
{
  "a.json": "3beeaadf5184e547dcb1ea3dfff12a833374a5ee",
  "a.png": "8706631f7a41695ed2160ad081a6c45ac0f080ba",
  "a.txt": "12563d0af099d19e60f89bc6ff327d01b3bf2926",
}
`);
  });

  it("should calculate the hash of both positive and negative match globs", () => {
    const map = hashGlobGit(["*.*", "!b.*"], {
      cwd: path.join(__dirname, "fixtures"),
      concurrency: 200,
    });

    expect(sortObject(map)).toMatchInlineSnapshot(`
{
  ".hiddenfile": "45a6961f4815da29087b3b68d97400a4376d80d6",
  "a.json": "3beeaadf5184e547dcb1ea3dfff12a833374a5ee",
  "a.png": "8706631f7a41695ed2160ad081a6c45ac0f080ba",
  "a.txt": "12563d0af099d19e60f89bc6ff327d01b3bf2926",
}
`);
  });

  it("should calculate the hash of dot files", () => {
    const map = hashGlobGit([], {
      cwd: path.join(__dirname, "fixtures"),
      concurrency: 200,
    });

    expect(sortObject(map)).toMatchInlineSnapshot(`
{
  ".hiddenfile": "45a6961f4815da29087b3b68d97400a4376d80d6",
  "a.json": "3beeaadf5184e547dcb1ea3dfff12a833374a5ee",
  "a.png": "8706631f7a41695ed2160ad081a6c45ac0f080ba",
  "a.txt": "12563d0af099d19e60f89bc6ff327d01b3bf2926",
  "b.txt": "8c39f112eff4bde989c74b6381ec75dffaa55c2a",
}
`);
  });
});
