const $ = (q) => document.querySelector(q);

const shortURL = () => {
  const urlToShort = $('#url-in').value;
  fetch('/shorten', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({ urlToShort }),
  }).then((response) => {
    switch (response.status) {
      case 406:
        $('#errorMessage').classList = 'error invalidURL';
        break;
      case 413:
        $('#errorMessage').classList = 'error longURL';
        break;
      case 429:
        $('#errorMessage').classList = 'error limitReached';
        break;
      case 500:
        $('#errorMessage').classList = 'error status500';
        break;
      default:
        $('#errorMessage').classList = 'success';
        response.json().then(({ url }) => navigator.clipboard.writeText($('#url-in').value = url));
    }
    $('#url-in').focus();
  });
}

const switchDark = (init = false) => {
  const item = window.localStorage.getItem('darkTheme') || window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (!!init === !!item) {
    document.body.classList.add('dark');
    !init && window.localStorage.setItem('darkTheme', true);
  } else {
    document.body.classList.remove('dark');
    !init && window.localStorage.removeItem('darkTheme');
  }
}

switchDark(true);