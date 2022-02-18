import Papa from "papaparse";

async function papaParse(source: any) {
  return await new Promise((resolve) =>
    Papa.parse(source, {
      complete: resolve,
    })
  );
}
export { papaParse };
