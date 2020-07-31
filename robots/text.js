const algorithmia = require("algorithmia");
const algorithmiaApiKey = require("../credentials/algorithmia.json").apiKey;
const sentenceBoundaryDetection = require("sbd");

async function robot(content) {
  await fechContentFromWikipedia(content);
  sanitizedContent(content);
  breakContentIntoSentences(content);
  async function fechContentFromWikipedia(content) {
    const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey);
    const wikipediaAlgorithm = algorithmiaAuthenticated.algo(
      "web/WikipediaParser/0.1.2?timeout=300"
    );
    const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm);

    const wikipediContent = wikipediaResponse.get();

    content.sourceContentOriginal = wikipediContent.content;
  }
  function sanitizedContent(content) {
    const withoutBlankLinesAndMakdown = removeBlankLinesAndMarkdown(
      content.sourceContentOriginal
    );

    const withoutDatesParenteses = removeDatesParenteses(
      withoutBlankLinesAndMakdown
    );

    content.sourceContentSanitized = withoutDatesParenteses;
  }
  function removeBlankLinesAndMarkdown(text) {
    const allLines = text.split("\n");
    const withoutBlankLines = allLines.filter((line) => {
      if (line.trim().length === 0 || line.trim().startsWith("=")) {
        return false;
      }
      return true;
    });

    return withoutBlankLines.join(" ");
  }

  function removeDatesParenteses(text) {
    return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, "").replace(/  /g, " ");
  }

  function breakContentIntoSentences(content) {
    content.sentences = [];
    const sentences = sentenceBoundaryDetection.sentences(
      content.sourceContentSanitized
    );
    sentences.forEach((sentence) => {
      content.sentences.push({
        text: sentence,
        keywords: [],
        images: [],
      });
    });
  }
}

module.exports = robot;
