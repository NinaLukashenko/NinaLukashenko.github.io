class NewsUI {
  constructor() {
    this.newsContainer = document.querySelector('.news-wrap .row');
  }

/**
 * addArticle - add an article to the UI
 * @param {Object} article [description]
 */
  addArticle(article) {
    // console.time();
    const template = NewsUI.generateArticleTemplate(article);

    // this.newsContainer.insertAdjacentHTML('afterbegin', template);
    
    //VARIANT FOR TAMPLATE WITH USAGE OF DOM METHODS (which is slower than the one above) :
    this.newsContainer.insertAdjacentElement('afterbegin', template);
    // console.timeEnd();
  }

/**
 * clearContainer description - cleans the container for articles
 * @return {[type]} [description]
 */
  clearContainer() {
    let first = this.newsContainer.firstElementChild;
    while (first) {
      this.newsContainer.removeChild(first);
      first = this.newsContainer.firstElementChild;
    }
  }

/**
 * generateArticleTemplate - creates an article template for adding it to UI
 * @param  {Object} article [description]
 * @return {[type]}         [description]
 */
  // static generateArticleTemplate(article) {
  //   return `
  //     <div class="col s12 m6">
  //         <div class="card">
  //             <div class="card-image">
  //                 <img src="${article.urlToImage}">
  //             </div>
  //             <div class="card-content">
  //                 <span class="card-title">${article.title || ''}</span>

  //                 <p>${article.description || ''}</p>
  //             </div>
  //             <div class="card-action">
  //                 <a href="${article.url}" target="_blank">Read more</a>
  //             </div>
  //         </div>
  //     </div>
  //   `;
  // }

/**
 * generateArticleTemplate - creates an article template for adding it to UI (variant with using DOM methods)
 * ! Is not a good one as time for drawing 1 article is about 0.8 - 0.1 ms, when using HTML template only 0.05 - 0.06 ms.
 * @param  {Object} article [description]
 * @return {[type]}         [description]
 */
  static generateArticleTemplate(article) {
    const articleDiv = document.createElement('div');
    articleDiv.classList.add('col', 's12', 'm6');

    const articleCard = document.createElement('div');
    articleCard.classList.add('card');
    articleDiv.appendChild(articleCard);

    const cardImg = document.createElement('div');
    cardImg.classList.add('card-image');
    cardImg.innerHTML = `<img src="${article.urlToImage}">`;
    articleCard.appendChild(cardImg);

    const cardContent = document.createElement('div');
    cardContent.classList.add('card-content');
    cardContent.innerHTML = `<span class="card-title">${article.title || ''}</span>
    <p>${article.description || ''}</p>`;
    articleCard.appendChild(cardContent);

    const cardAct = document.createElement('div');
    cardAct.classList.add('card-action');
    cardAct.innerHTML = `<a href="${article.url}" target="_blank">Read more</a>`;
    articleCard.appendChild(cardAct);

    return articleDiv;
  }
}