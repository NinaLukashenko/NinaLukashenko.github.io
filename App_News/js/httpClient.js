class HttpClient {
  /**
   * get - makes the request to the server
   * @param  {String}   url      [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  get(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('X-Api-Key', ENV.apiKey);
    xhr.send();
    xhr.addEventListener('load', () => callback(JSON.parse(xhr.responseText)));
  }
}