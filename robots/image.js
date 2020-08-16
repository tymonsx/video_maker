const imageDownloader = require("image-downloader");

const google = require("googleapis").google;
const customSearch = google.customsearch("v1");
const state = require("./state.js");

const googleSearchCredentials = require("../credentials/google-search.json");
async function robot() {
  console.log("> [image-robot] Iniciando...");
  const content = state.load();
  await fetchImagesOfAllSentences(content);
  await downloadAllImages(content);

  state.save(content);

  async function fetchImagesOfAllSentences(content) {
    //for (const sentence of content.sentences) {
    for (
      let sentenceIndex = 0;
      sentenceIndex < content.sentences.length;
      sentenceIndex++
    ) {
      let query;
      if (sentenceIndex === 0) {
        query = `${content.searchTerm}`;
      } else {
        query = `${content.searchTerm} ${content.sentences[sentenceIndex].keywords[0]}`;
      }

      console.log(
        `> [image-robot] Pesquisando Imagens no Google com: "${query}"`
      );
      //sentence.images = await fetchGoogleAndReturnImagesLinks(query);
      content.sentences[
        sentenceIndex
      ].images = await fetchGoogleAndReturnImagesLinks(query);
      //sentence.googleSearchQuery = query;
      content.sentences[sentenceIndex].googleSearchQuery = query;
    }
  }
  async function fetchGoogleAndReturnImagesLinks(query) {
    const response = await customSearch.cse.list({
      auth: googleSearchCredentials.apiKey,
      cx: googleSearchCredentials.searchEngineId,
      q: query,
      searchType: "image",
      num: 2,
    });
    const imagesUrl = response.data.items.map((item) => {
      return item.link;
    });
    return imagesUrl;
  }
  async function downloadAllImages(content) {
    content.downloadedImages = [];

    for (
      let sentenceIndex = 0;
      sentenceIndex < content.sentences.length;
      sentenceIndex++
    ) {
      const images = content.sentences[sentenceIndex].images;

      for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
        const imageUrl = images[imageIndex];

        try {
          //await downloadImage()
          if (content.downloadedImages.includes(imageUrl)) {
            throw new Error("Imagem já foi baixada");
          }
          await downloadAndSave(imageUrl, sentenceIndex + "-original.png");
          content.downloadedImages.push(imageUrl);
          console.log(
            "> [image-robot] [" +
              sentenceIndex +
              "] [" +
              imageIndex +
              "]> baixou imagem com sucesso: " +
              imageUrl
          );
          break;
        } catch (error) {
          console.log(
            "> [image-robot] [" +
              sentenceIndex +
              "] [" +
              imageIndex +
              "]> Erro ao baixar imagem: " +
              imageUrl,
            error
          );
        }
      }
    }
  }

  async function downloadAndSave(url, fileName) {
    return imageDownloader.image({
      url: url,
      dest: "./content/" + fileName,
    });
  }
}

module.exports = robot;
