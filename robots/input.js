const readLine = require("readLine-sync");
const state = require("./state.js");

function robot() {
  const content = {
    maximumSentences: 7,
  };

  content.searchTerm = askAndReturnSearchTerm();
  content.prefix = askAndReturnPrefix();
  state.save(content);

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
}

module.exports = robot;
