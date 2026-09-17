/**
 * Capture desktop + mobile screenshots of a live site for a case study.
 *
 * Usage
 * -----
 *   1. Start Chrome with a debugging port (one line, any terminal):
 *
 *      "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new \
 *        --disable-gpu --hide-scrollbars --remote-debugging-port=9222 \
 *        --user-data-dir=%TEMP%\shot-profile about:blank
 *
 *   2. node tools/capture-screenshots.mjs <slug> <base-url> [#anchor ...]
 *
 *      node tools/capture-screenshots.mjs my-favorite-diner https://myfavoritediner.com / /#menu /menu
 *
 * Files land in public/work/<slug>/ as desktop-*.webp and mobile-*.webp, at
 * exactly the sizes src/lib/projects.ts expects (2880x1800 and 780x1688).
 *
 * Why the DevTools Protocol rather than `chrome --screenshot`: that flag cannot
 * scroll, so any site that reveals content on scroll comes out blank below the
 * fold, and it cannot emulate a 390px viewport — it would just shrink the
 * desktop layout instead of triggering the real mobile one.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const PORT = Number(process.env.CDP_PORT ?? 9222);
const [, , SLUG, BASE, ...PATHS] = process.argv;

if (!SLUG || !BASE) {
  console.error("Usage: node tools/capture-screenshots.mjs <slug> <base-url> [path ...]");
  process.exit(1);
}

const paths = PATHS.length > 0 ? PATHS : ["/"];
const OUT = join(process.cwd(), "public", "work", SLUG);
mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const IPHONE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 " +
  "(KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

const VIEWPORTS = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false },
  mobile: { width: 390, height: 844, deviceScaleFactor: 2, mobile: true },
};

/** Turns "/#menu" into "menu", "/menu" into "menu", "/" into "home". */
function nameFor(path) {
  const cleaned = path.replace(/^\/#?/, "").replace(/[/#]/g, "-");
  return cleaned === "" ? "home" : cleaned;
}

class CDP {
  #ws;
  #id = 0;
  #pending = new Map();
  #handlers = new Map();

  static async attach(wsUrl) {
    const cdp = new CDP();
    cdp.#ws = new WebSocket(wsUrl);
    await new Promise((res, rej) => {
      cdp.#ws.addEventListener("open", res, { once: true });
      cdp.#ws.addEventListener("error", rej, { once: true });
    });
    cdp.#ws.addEventListener("message", (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && cdp.#pending.has(msg.id)) {
        const { resolve, reject } = cdp.#pending.get(msg.id);
        cdp.#pending.delete(msg.id);
        msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
      } else if (msg.method && cdp.#handlers.has(msg.method)) {
        cdp.#handlers.get(msg.method).forEach((fn) => fn(msg.params));
        cdp.#handlers.delete(msg.method);
      }
    });
    return cdp;
  }

  send(method, params = {}) {
    const id = ++this.#id;
    return new Promise((resolve, reject) => {
      this.#pending.set(id, { resolve, reject });
      this.#ws.send(JSON.stringify({ id, method, params }));
    });
  }

  once(method, timeout = 20000) {
    return new Promise((resolve) => {
      const list = this.#handlers.get(method) ?? [];
      list.push(resolve);
      this.#handlers.set(method, list);
      setTimeout(resolve, timeout);
    });
  }

  close() {
    this.#ws.close();
  }
}

const tab = await (
  await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" })
).json();

const cdp = await CDP.attach(tab.webSocketDebuggerUrl);
await cdp.send("Page.enable");
await cdp.send("Runtime.enable");

for (const kind of ["desktop", "mobile"]) {
  for (const path of paths) {
    const [pathname, hash] = path.split("#");

    await cdp.send("Emulation.setDeviceMetricsOverride", VIEWPORTS[kind]);
    await cdp.send("Emulation.setUserAgentOverride", {
      userAgent: kind === "mobile" ? IPHONE_UA : "",
    });

    const loaded = cdp.once("Page.loadEventFired");
    await cdp.send("Page.navigate", { url: new URL(pathname || "/", BASE).href });
    await loaded;

    // Fonts, hero imagery and any database-backed content settle after load.
    await sleep(3500);

    if (hash) {
      await cdp.send("Runtime.evaluate", {
        expression: `
          (() => {
            const el = document.querySelector("#${hash}");
            if (el) el.scrollIntoView({ block: "start", behavior: "instant" });
          })()
        `,
      });
      // Let the site's own reveal-on-scroll observers fire before capturing.
      await sleep(1600);
    }

    const { data } = await cdp.send("Page.captureScreenshot", {
      format: "webp",
      quality: 88,
      captureBeyondViewport: false,
    });

    const file = join(OUT, `${kind}-${nameFor(path)}.webp`);
    writeFileSync(file, Buffer.from(data, "base64"));
    console.log(`${file}  ${(Buffer.from(data, "base64").length / 1024) | 0} KB`);
  }
}

cdp.close();
console.log("\nDone. Reference these in src/lib/projects.ts.");
