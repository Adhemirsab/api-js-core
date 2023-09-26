import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/functions/*.ts"],
  bundle: true,
  minify: true,
  platform: "node",
  outdir: "dist",
  format: "esm",
  banner: {
    js: `
    const require = (await import("node:module")).createRequire(import.meta.url);
    const __filename = (await import("node:url")).fileURLToPath(import.meta.url);
    const __dirname = (await import("node:path")).dirname(__filename);
    `,
  },
});
