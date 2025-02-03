import { issueURL } from "../config/url.js";
import { displayIssues } from "../utils/data.js";
import { getParameterByName } from "../utils/url_query.js";

var statusQuery = getParameterByName('open');

// Function to get cookie by name
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

// Function to delete cookie by name
function deleteCookie(name) {
    document.cookie = name + "=; Max-Age=-99999999;";
}

function getIssues() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    if (statusQuery === "false") {
        var fetchURL = issueURL + "?open=false"
    } else {
        var fetchURL = issueURL + "?open=true"
    }

    console.log("API URL :" + fetchURL)
    var status = getParameterByName('open');
    fetch(fetchURL, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Something went wrong!');
            }
        })
        .then(data => {
            displayIssues(data.data);
            const spinner = document.getElementById('spinner');
            const container = document.querySelector('.container');
            spinner.classList.add('fade-out');
            spinner.addEventListener('animationend', () => {
                spinner.style.display = 'none';
                container.removeAttribute('hidden');
                container.classList.add('fade-in');
            });
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            const spinner = document.getElementById('spinner');
            spinner.classList.add('fade-out');
            spinner.addEventListener('animationend', () => {
                spinner.style.display = 'none';
                const container = document.querySelector('.container');
                container.removeAttribute('hidden');
                container.innerHTML = '<p class="text-white">Failed to load issues. Please try again later.</p>';
                container.classList.add('fade-in');
            });
        });
}

function initialize() {
    getIssues();

    const logoutButton = document.getElementById('logout-button');
    const token = getCookie('token');

    if (!token) {
        logoutButton.style.display = 'none';
    }

    logoutButton.addEventListener('click', function() {
        deleteCookie('token');
        window.location.href = 'https://scipio.hlcyn.co/login/';
    });
}

window.onload = initialize;