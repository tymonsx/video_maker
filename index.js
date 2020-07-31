const readLine = require("readLine-sync");

function start() {
  const content = {};

  content.searchTerm = askAndReturnSearchTerm();
  content.prefix = askAndReturnPrefix();

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

  console.log(content);
}
start();
