$(document).ready(function () {
    console.log('onload')
    showBoard();
})

function pushPostBtn() {
    window.location.href = 'post_board';
}

function showPost(no, title, postBody){
    let postForm = {
        'title' : title,
        'postBody' : postBody
    }
    localStorage.setItem(no, postForm);
    alert('storage save done');
    window.location.href = `/board/read?no=${no}`;
}
// function showPost(title) {
//     console.log('showpost');
//     console.log(`t: ${title}}`);
//     $.ajax({
//         type: 'GET',
//         url: `/board/read?title=${title}`,
//         data: {},
//         success:function(response) {
//             if(response['result'] == 'success'){
//                 let post = response['post'];
//                 let postUser = post['userId'];
//                 let postTitle = post['postTitle'];
//                 let postBody = post['postBody'];
//                 let postHtml = `<ul>
//                                     <li><p>작성자 : ${postUser}</p></li>
//                                     <li><p>게시물 제목</p><input type="text" id="post-head" placeholder=${postTitle}></li>
//                                     <li><p>게시물 내용</p><textarea id="post-body" placeholder=${postBody}></textarea></li>
//                                 </ul>`
//                 $('#read-post').append(postHtml);
//                 location.replace(`/board/read/${title}`)
//             } else {
//                 alert('NOT OK');
//             }
//         }
//     })
// }

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
                    let postHtml = `<tr>
                                        <th scope="row" class="post-no">${no}</th>
                                        <td class="post-title"><a href="#" onclick="showPost(${no}, ${title}, ${postBody})">${title}</a></td>
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
                                        <td class="post-title"><a href="#" onclick="showPost(${title})">${title}</a></td>
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