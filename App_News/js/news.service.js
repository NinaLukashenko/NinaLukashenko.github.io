const httpClient = new HttpClient();

class NewsService {
  /**
   * getTopHeadlinesNews - creates url for the request
   * @param  {String}   country  [description]
   * @param  {String}   category [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  getTopHeadlinesNews(country = ENV.country, category = ENV.category, callback) {
    httpClient.get(`${ENV.apiUrl}/top-headlines?country=${country}&category=${category}`, callback);
  }

  getEverythingNews(q, callback) {
    httpClient.get(`${ENV.apiUrl}/everything?q=${q}`, callback);
  }
}