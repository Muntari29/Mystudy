$(document).ready(function () {
    console.log('onload')
    loginCheck();
    showBoard();
    
})

function pushPostBtn() {
    window.location.href = 'post_board';
}

function showPost(userId, title, postBody){
    console.log(typeof(userId), userId);
    let postForm = {
        'userId' : userId,
        'postBody' : postBody
    }
    sessionStorage.title = JSON.stringify(postForm);
    alert('storage save done');
    window.location.href = `/board/read?title=${title}`;
}

function showBoard() {
    console.log('showboard')
    $.ajax({
        type: 'GET',
        url: '/board/show?offset=1&limit=5',
        data: {},
        success: function (response) {
            if (response['result'] == 'success') {
                let postList = response['post_list'];
                console.log(postList);
                for (let i = 0; i < postList.length; i++) {
                    let no = i + 1
                    let title = postList[i]['postTitle']
                    let postBody = postList[i]['postBody']
                    let like = postList[i]['like']
                    let time = postList[i]['time']
                    let userId = postList[i]['userId']
                    console.log(`showBOARD : userId ${userId}, title ${title}, body ${postBody}`)
                    let postHtml = `<tr>
                                        <th scope="row" class="post-no">${no}</th>
                                        <td class="post-title"><a href="#" onclick="showPost('${userId}', '${title}', '${postBody}')">${title}</a></td>
                                        <td class="post-userId">${userId}</td>
                                        <td class="post-time">${time}</td>
                                        <td class="post-like">${like}</td>             
                                    </tr>`
                    $('#pivot').append(postHtml);
                }
            } else {
                console.log('no nono');
            }
        }
    })
}

function showPagination(offset, limit) {
    $('#pivot').empty();
    $.ajax({
        type: 'GET',
        url: `/board/show?offset=${offset}&limit=${limit}`,
        data: {},
        success: function (response) {
            if (response['result'] == 'success') {
                let postList = response['post_list'];
                for (let i = 0; i < postList.length; i++) {
                    let no = offset + i
                    let title = postList[i]['postTitle']
                    let postBody = postList[i]['postBody']
                    let like = postList[i]['like']
                    let time = postList[i]['time']
                    let userId = postList[i]['userId']
                    let postHtml = `<tr>
                                        <th scope="row" class="post-no">${no}</th>
                                        <td class="post-title"><a href="#" onclick="showPost('${userId}', '${title}', '${postBody}')">${title}</a></td>
                                        <td class="post-userId">${userId}</td>
                                        <td class="post-time">${time}</td>
                                        <td class="post-like">${like}</td>             
                                    </tr>`
                    $('#pivot').append(postHtml);
                }
            } else {
                console.log('no nono');
            }
        }
    })
}