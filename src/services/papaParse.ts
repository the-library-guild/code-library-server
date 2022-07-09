import Papa, { ParseResult } from "papaparse";

/**
 * promisification of the spreadsheet reading library PapaParse
 */
async function papaParse(source: string): Promise<ParseResult<any>> {
  return await new Promise((resolve) =>
    Papa.parse(source, {
      complete: resolve,
    })
  );
}
export { papaParse };
