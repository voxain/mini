const qs = q => document.querySelector(q);

function shortURL() {
    const urlToShort = qs('#url-in').value;
    fetch('/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({ urlToShort })
    }).then(response => {
        switch (response.status){
            case 406:
                qs('#errorMessage').classList = 'error invalidURL';
                break;
                
            case 413:
                qs('#errorMessage').classList = 'error longURL';
                break;
                
            case 429:
                qs('#errorMessage').classList = 'error limitReached';
                break;
                
            case 500:
                qs('#errorMessage').classList = 'error status500';
                break;

            default:
                qs('#errorMessage').classList = 'success';
                response.json().then(re => {
                    parseNewURL(re)
                });
        }
        
        qs('#url-in').focus();
    });
}

function parseNewURL(short){
    navigator.clipboard.writeText(short.url)
    qs('#url-in').value = short.url;
}

if(window.localStorage.getItem('darkTheme')) qs('#dark-theme').href='/stylesheets/dark.css';

function switchDark(){
    if(qs('#dark-theme').href.endsWith('/stylesheets/dark.css')){
        qs('#dark-theme').href='';
        window.localStorage.removeItem('darkTheme');
    }
    else {
        qs('#dark-theme').href='/stylesheets/dark.css';
        window.localStorage.setItem('darkTheme', true);
    }
}