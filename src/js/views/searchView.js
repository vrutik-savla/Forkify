'use strict';

class SearchView {
  #parentElement = document.querySelector('.search');

  getQuery() {
    const query = this.#parentElement.querySelector('.search__field').value;
    this.#clearInput();
    return query;
  }

  #clearInput() {
    this.#parentElement.querySelector('.search__field').value = '';
  }

  addhandlerSearch(handlerFunc) {
    this.#parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handlerFunc();
    });
  }
}

export default new SearchView();
