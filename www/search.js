class Search {
  static searchBox = document.querySelector('#query');
  static searchResult = document.querySelector('#search-result');
  static lastQueried = null;
  static lastQueryEnd = 0;
  static noMoreResult = false;

  static getQueryString = () => {
    return this.searchBox.value;
  }

  static checkIfQueryChanged = () => {
    return this.getQueryString() !== this.lastQueried;
  }

  static addSearchResult = (result) => {
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('result-item');

    const resultElement = document.createElement('a');
    resultElement.classList.add('name');
    resultElement.innerText = result.name;
    resultElement.target = '_blank';
    resultElement.href = result.link;

    const linkElement = document.createElement('a');
    linkElement.classList.add('link');
    linkElement.innerText = '[LINK]';
    linkElement.target = '_blank';
    linkElement.href = `${location.href}link?id=${result.id}`;
   
    resultDiv.append(resultElement);
    resultDiv.append(linkElement);
    this.searchResult.append(resultDiv);
  }

  static addBlankResult = () => {
    if(!this.searchResult.querySelector('#blank-result')) {
      const blankDiv = document.createElement('div');
      blankDiv.id = 'blank-result';
      blankDiv.innerText = '더 이상 표시할 결과 없음';
      this.searchResult.append(blankDiv);
    }
  }

  static addErrorResult = () => {
    if(!this.searchResult.querySelector('#error-result')) {
      const errorDiv = document.createElement('div');
      errorDiv.id = 'error-result';
      errorDiv.innerText = '검색 오류';
      this.searchResult.append(errorDiv);
    }
  }

  static newSearch = () => {
    this.lastQueryEnd = 0;
    this.noMoreResult = false;
    this.searchResult.textContent = '';
    this.lastQueried = this.getQueryString();
    this.scrollMore();
  }

  static scrollMore = async () => {
    if(this.noMoreResult) return;
    if(this.checkIfQueryChanged()) return this.newSearch();
    const queryString = this.getQueryString();
    const queryRange = {
      start: this.lastQueryEnd,
      end: this.lastQueryEnd + 10
    };
    this.lastQueryEnd += 10;

    return this.fetch(queryString, queryRange)
    .then(json => {
      json.forEach(this.addSearchResult);
  
      if(json.length == 0) {
        this.addBlankResult();
        this.noMoreResult = true;
      }
      return json;
    })
    .catch(err => {
      console.log(err);
      this.addErrorResult();
    });
  }

  static fetch = async (queryString, queryRange) => {
    return fetch('/link/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ string: queryString, range: queryRange })
    })
    .then(res => res.json());
  }
};

document.querySelector('#search').addEventListener('click', e => {
  Search.newSearch();
});