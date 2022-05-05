import { readLines } from "https://deno.land/std/io/mod.ts";

async function loadConverter() {
  const dict = {};
  const fileReader = await Deno.open("ipa.lst");
  for await (const line of readLines(fileReader)) {
    const [cmu, ipa] = line.split(" ", 2);
    dict[cmu] = ipa;
  }
  return dict;
}

function conv(converter, cmu) {
  return cmu.split(" ")
    .map((str) => converter[str])
    .join(" ");
}

async function build() {
  const result = [];
  const converter = await loadConverter();
  const fileReader = await Deno.open("cmudict/cmudict.dict");
  for await (const line of readLines(fileReader)) {
    const word = line.split(" ", 1)[0];
    const cmu = line.slice(word.length + 1).split(" #")[0];
    const ipa = conv(converter, cmu);
    result.push(`${word}\t${ipa}`);
  }
  return result;
}

const result = await build();
Deno.writeTextFileSync("cmudict.ipa", result.join("\n"));
