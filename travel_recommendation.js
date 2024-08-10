const searchInput = document.getElementById('search-input');
const dropdownMenu = document.querySelector('.dropdown-menu');
const dropdownDiv = document.getElementById('dropdown-div');
const clear = document.getElementById('button-clear');

const keywordMap = {
    beach: /^beach(es)?$/,
    temple: /^temple(s)?$/,
    country: /^countr(y|ies)$/
};

searchInput.addEventListener('focus', function() {
    dropdownMenu.classList.add('show');
});

searchInput.addEventListener('input', function() {
    clear.disabled = !searchInput.value;
    performSearch();
});

clear.addEventListener('click', function() {
    searchInput.value = '';
    clear.disabled = true;
    dropdownMenu.classList.remove('show');
    dropdownDiv.innerHTML = '<p class="p-5 text-center">Type again to see results</p>';
});
    
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function(event) {
        event.preventDefault();
        searchInput.value = event.target.dataset.value;
        dropdownMenu.classList.remove('show');
    });
});

function performSearch() {
    const query = searchInput.value.toLowerCase();

    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            let results = [];

            if (keywordMap.beach.test(query)) {
                results = data.beaches;
            } else if (keywordMap.temple.test(query)) {
                results = data.temples;
            } else if (keywordMap.country.test(query)) {
                results = data.countries.flatMap(country => country.cities);
            } else {
                results = [
                    ...data.beaches,
                    ...data.temples,
                    ...data.countries.flatMap(country => country.cities)
                ].filter(item => item.name.toLowerCase().includes(query)); 
            }

            displayResultsInDropdown(results);
        })
        .catch(error => console.error('API error:', error));
}

function displayResultsInDropdown(results) {
    dropdownDiv.innerHTML = '';

    if (results.length === 0) {
        dropdownDiv.innerHTML = '<p class="p-5 text-center">No results found.</p>';
    } else {
        results.forEach(item => {
            const dropdownItem = document.createElement('div');
            dropdownItem.classList.add('card', 'm-2');
            dropdownItem.style.cssText = 'width:24rem';

            dropdownItem.innerHTML = `
                <div class="row g-0 text-start">
                    <div class="col-md-6">
                        <img src="${item.imageUrl}" class="card-img-top rounded-start h-100" alt="${item.name}">
                    </div>
                    <div class="col-md-6">
                        <div class="card-body">
                            <h5 class="card-title">${item.name}</h5>
                            <p class="card-text">${item.description}</p>
                            <a href="#" class="btn btn-sm btn-secondary">Go</a>
                        </div>
                    </div>
                </div>`;
            
            dropdownDiv.appendChild(dropdownItem);
        });
    }

    dropdownMenu.classList.add('show');
}