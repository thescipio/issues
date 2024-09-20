import { formatDate } from "./parse.js";
import { getMyID } from "./myid.js";
import { token } from "../config/cookies.js";

export function displayIssues(datas) {
    const tableBody = document.getElementById('content_body');
    tableBody.innerHTML = '';

    datas.forEach(post => {
        const card = document.createElement('div');
        const formattedDate = formatDate(post.date);

        card.innerHTML = `
        <div class="issue-container flex items-center mt-6">
            <div class="issue-content">
                <a href="post.html?id=${post.issue_id}">
                    <div class="mt-3 text-1xl text-white font-bold text-left">
                    ${post.title}
                    </div>
                </a>
                <div class="issue-details mt-2">
                    <span class="issue-info">
                        <span class="text-xs material-symbols-outlined mr-2">face</span>
                        ${post.author_name}
                    </span>
                    <span class="issue-info">
                        <span class="text-xs material-symbols-outlined mr-2">smartphone</span>
                        ${post.device_parsed}
                    </span>
                </div>
                <div class="issue-details">
                    <span class="text-sm">${formattedDate}</span>
                </div>
            </div>
            <a href="post.html?id=${post.issue_id}" class="chevron-button ml-auto bg-pink-300 hover:bg-pink-500 text-black py-1 px-6 rounded-3xl" style="background-color: #660025; color: #ffd9de; text-decoration: none;">
                ›
            </a>
        </div>

        <div class="flex items-center mt-4">
            <div class="w-full" style="height: 2px; background-color: #514245;"></div>
        </div>
        `;
        tableBody.appendChild(card);
    });
}

export async function displayPost(data) {
    const tableBody = document.getElementById('mainpost_body');
    tableBody.innerHTML = '';

    let myID = null;
    try {
        myID = await getMyID();
    } catch (error) {
        console.error('Error fetching my ID:', error);
        // Continue without myID
    }

        const card = document.createElement('div');
        const formattedDate = formatDate(data.date);

        card.innerHTML = `
        <div class="flex items-center mb-6">
            <div>
                <a onclick="window.history.back()" class="text-4xl">‹</a>
                <h1 class="text-white text-4xl font-semibold">${data.title}</h1>
                <span class="issue-info">
                    <span class="text-xs material-symbols-outlined">face</span>
                    ${data.author_name}
                    <span class="text-lg">&nbsp;&nbsp;•&nbsp;&nbsp;</span>
                    <span class="text-xs material-symbols-outlined">smartphone</span>
                    ${data.device_parsed}
                </span>
                <span class="text-sm">${formattedDate}</span>
            </div>
            <div id="postctrls" class="ml-auto py-1 px-6 rounded-3xl">
                <span class="text-lg">&nbsp;&nbsp;</span>
                <a href="edit.html?id=${data.issue_id}">
                    <span class="text-xs material-symbols-outlined">edit</span>
                </a>
            </div>
        </div>

        <div>
            <h3 class="text-white font-bold py-1">Issue Details</h3>
            <div class="body-card">
                <p>
                    ${data.description}
                </p>
            </div>
        </div>
        `;

        if (data.user_id !== myID) {
            const postctrlsDiv = card.querySelector('#postctrls');
            if (postctrlsDiv) {
                postctrlsDiv.style.display = 'none';
            }
        }

        tableBody.appendChild(card);

        if (data.status == "closed") {
            document.getElementById('commentbox').style.display = 'none';
            document.getElementById('login2comment').style.display = 'none';
        } else if (data.status == "open") {
            if (token == "") {
                document.getElementById('commentbox').style.display = 'none';
            } else {
                document.getElementById('login2comment').style.display = 'none';
            }
            document.getElementById('postclosed').style.display = 'none';
        }
}

export function displayComments(datas) {
    const tableBody = document.getElementById('comment_body');
    tableBody.innerHTML = '';

    datas.forEach(post => {
        if (post.status === "open") {
            const card = document.createElement('div');
            const formattedDate = formatDate(post.date);

            card.innerHTML = `
            <div class="my-5 px-4 py-4 rounded-xl" style="background-color: #31292a;">
                <div>
                    <h1 class="text-white font-bold">
                        <span class="material-symbols-outlined justify-center align-middle items-center mr-1">
                            chat_bubble
                        </span>
                        ${post.author_name}
                    </h1>
                    <p>
                        ${post.description}
                    </p>
                    <span class="text-xs font-normal">${formattedDate}</span>
                </div>
            </div>

            <div class="flex items-center mt-4">
                <div class="w-full" style="height: 2px; background-color: #514245;"></div>
            </div>
            `;
            tableBody.appendChild(card);
        }
    });
}