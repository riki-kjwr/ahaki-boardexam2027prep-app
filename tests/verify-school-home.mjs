import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import vm from "node:vm";

const expectedBlob = "f4149d0df0a4cbbfe427bd55138cc562ea05f482";
const data = readFileSync("oniki.html");
const blob = createHash("sha1")
  .update(Buffer.from("blob " + data.byteLength + "\0"))
  .update(data).digest("hex");
assert.equal(blob, expectedBlob, "鬼木アプリの原本とバイトが一致しません");

const app = data.toString("utf8");
const entry = app.match(/const APPS=(\{[^;]+\});\s*const TITLES=/);
assert.ok(entry, "既存4アプリのAPPS定義が見つかりません");
const apps = JSON.parse(entry[1]);
assert.deepEqual(Object.keys(apps), ["grad", "term", "class", "national"]);
for (const kind of Object.keys(apps)) {
  const child = Buffer.from(apps[kind], "base64").toString("utf8");
  assert.ok(child.includes("oniki-fourway-" + kind + "-trial-20261120-v1"),
    kind + " の保存キーが一致しません");
}

const homepage = readFileSync("index.html", "utf8");
assert.match(homepage, /鬼木学園/);
assert.match(homepage, /日本医専/);
assert.match(homepage, /href="\.\/oniki\.html"/);
assert.doesNotMatch(homepage, /localStorage\s*\.|indexedDB\s*\.|sessionStorage\s*\./,
  "学校ホームが学習データにアクセスしています");
assert.equal(existsSync("judo.html"), false, "未完成のjudo.htmlは今回作らない");

const inline = homepage.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(inline, "旧URLの互換処理がありません");
for (const kind of Object.keys(apps)) {
  let redirect = null;
  const location = {hash: "#app=" + kind, search: "", replace(v) { redirect = v; }};
  vm.runInNewContext(inline[1], { location });
  assert.equal(redirect, "./oniki.html#app=" + kind, "古いURLからの転送に失敗");
}
console.log("PASS: バイト単位の原本一致、4アプリの保存キー、学校ホーム、旧URL互換");
