const readLine = require("readLine-sync");
const robots = {
  text: require("./robots/text.js"),
};
async function start() {
  const content = {
    maximumSentences: 7,
  };

  content.searchTerm = askAndReturnSearchTerm();
  content.prefix = askAndReturnPrefix();

  await robots.text(content);

  function askAndReturnSearchTerm() {
    return readLine.question(
      "Manda um Termo do wikipedia para eu devorar =D : "
    );
  }

  function askAndReturnPrefix() {
    const prefixes = ["Who is", "What is", "The History of"];
    const selectPrefixIndex = readLine.keyInSelect(
      prefixes,
      "Escolhe uma Opção (por enquanto vai ser em inglês):"
    );
    const selectedPrefixText = prefixes[selectPrefixIndex];

    return selectedPrefixText;
  }

  console.log(JSON.stringify(content, null, 4));
}
start();
