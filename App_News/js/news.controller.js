const newsService = new NewsService();
const uiService = new NewsUI();
const notificationUI = new NotificationUI();

//UI Elements
const form = document.forms['newsControlForm'];
const countrySelect = form['country'];
const categorySelect = form['category'];
const searchInput = document.getElementById('search');


/**
 * onSelectChange - process the response from the server 
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
function onSelectChange() {
  const country = countrySelect.value;
  const category = categorySelect.value;
  if (!country || !category) return console.error('Please, select some country and category');
  newsService.getTopHeadlinesNews(country, category, (response) => {
    const { totalResults, articles } = response;

    uiService.clearContainer();

    articles.forEach((article) => uiService.addArticle(article));  
  });
}


/**
 * onInputChange - processes the response from the server
 * @return {[type]} [description]
 */
function onInputChange() {
  const q = searchInput.value;
  if (q.length > 3) {
    newsService.getEverythingNews(q, (response) => {
      const { totalResults, articles } = response;

      uiService.clearContainer();

      articles.forEach((article) => uiService.addArticle(article));  

      notificationUI.clearContainer();

      if (!totalResults) {
        notificationUI.addNotification('Sorry, but nothing was found:(');   
      };
    })
  }
}


countrySelect.addEventListener('change', onSelectChange);
categorySelect.addEventListener('change', onSelectChange);

searchInput.addEventListener('input', onInputChange);


