const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsDiv = document.getElementById('results');
const reposDiv = document.getElementById('repos');
const toggleButton = document.getElementById('toggle-search');

let searchType = 'users'; // Default search type

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        if (searchType === 'users') {
            searchUsers(query);
        } else {
            searchRepos(query);
        }
    }
});

toggleButton.addEventListener('click', () => {
    searchType = searchType === 'users' ? 'repos' : 'users';
    toggleButton.textContent = searchType === 'users' ? 'Search Repos' : 'Search Users';
    searchInput.placeholder = searchType === 'users' ? 'Search GitHub Users...' : 'Search GitHub Repos...';
    resultsDiv.innerHTML = '';
    reposDiv.innerHTML = '';
});

function searchUsers(query) {
    fetch(`https://api.github.com/search/users?q=${query}`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    })
    .then(response => response.json())
    .then(data => displayUsers(data.items))
    .catch(error => console.error('Error fetching users:', error));
}

function displayUsers(users) {
    resultsDiv.innerHTML = '';
    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.innerHTML = `
            <img src="${user.avatar_url}" alt="${user.login}" width="50">
            <a href="${user.html_url}" target="_blank">${user.login}</a>
        `;
        userDiv.addEventListener('click', () => fetchUserRepos(user.login));
        resultsDiv.appendChild(userDiv);
    });
}

function fetchUserRepos(username) {
    fetch(`https://api.github.com/users/${username}/repos`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    })
    .then(response => response.json())
    .then(data => displayRepos(data))
    .catch(error => console.error('Error fetching repos:', error));
}

function displayRepos(repos) {
    reposDiv.innerHTML = '<h2>Repositories:</h2>';
    repos.forEach(repo => {
        const repoDiv = document.createElement('div');
        repoDiv.innerHTML = `
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
        `;
        reposDiv.appendChild(repoDiv);
    });
}