function search() {
  const queryString = document.querySelector('#query').value;
  const pullerDiv = document.querySelector('#puller');
  const resultDiv = document.querySelector('#search-result');

  if(pullerDiv) pullerDiv.remove();
  resultDiv.textContent = '';

  fetch('/link/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: queryString })
  })
  .then(res => res.json())
  .then(json => {
    json.forEach(file => {
      const fileName = file.name;
      const fileLink = file.link;

      const resultElement = document.createElement('a');
      resultElement.classList.add('result-item');
      resultElement.innerText = fileName;
      resultElement.target = '_blank';
      resultElement.href = fileLink;

      resultDiv.append(resultElement);
    });

    if(json.length == 0) {
      const blankDiv = document.createElement('div');
      blankDiv.id = 'blank-result';
      blankDiv.innerText = '표시할 결과 없음';
      resultDiv.append(blankDiv);
    }
  })
  .catch(err => {
    console.log(err);
    const errorDiv = document.createElement('div');
    errorDiv.id = 'error-result';
    errorDiv.innerText = '검색 오류';
    resultDiv.append(errorDiv);
  });
}

window.addEventListener('load', function() {
  document.querySelector('#search').onclick = search;
});