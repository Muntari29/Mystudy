$(document).ready(function () {
    console.log('onload');
    console.log('main.js');
    loginCheck();
})

function userSignup() {
    let userId = $('#signup-id').val();
    let userPw = $('#signup-pw').val();
    let userPw2 = $('#signup-pw-2').val();

    if (userPw != userPw2) {
        return alert('비밀번호가 일치하지 않습니다.');
    }
    console.log(userId, userPw)
    $.ajax({
        type: 'POST',
        url: '/user/signup',
        data: {
            'userId': userId,
            'userPw': userPw
        },
        success: function (response) {
            if (response['result'] == 'success') {
                alert('SignUp Success');
                // 완료후 모달 창 닫음.
                $('#SignUpModal').modal('hide');
            } else {
                // 회원가입시 실패(아이디가 존재하는 경우) 로그인 페이지로 전환
                alert('Exist_User');
            }
        }
    })
}

function userSignin(){
    let userId = $('#signin-id').val();
    let userPw = $('#signin-pw').val();
    console.log(111);
    $.ajax({
        type: 'POST',
        url: '/user/signin',
        data: {
            'userId' : userId,
            'userPw' : userPw
        },
        success:function(response){
            if (response['result'] == 'success'){
                sessionStorage.setItem('token', response['access_token']);
                // localStorage.setItem('token', response['access_token'])
                alert('Storage_token_Save!!');
                // 완료후 모달 창 닫음.
                // 모달 메소드가 작동하지 않을 경우 제이쿼리스크립트를 먼저 불러온 후 부트스트램을 불러와야함
                $('#SignInModal').modal('hide');
                window.location.reload();
            } else {
                alert('no ok')
            }
        }
    })
}

function addPost(){
    let access_token = sessionStorage.getItem("token");
    console.log(access_token);
    let user = $('#post-user').val();
    let title = $('#post-head').val();
    let postBody = $('#post-body').val();
    $.ajax({
        type: 'POST',
        url: '/board/post',
        data: {
            'userId' : user,
            'title' : title,
            'body' : postBody
        },
        // beforeSend: function(xhr) {
        //     xhr.setRequestHeader('Content-type', 'application/json')
        //     xhr.setRequestHeader('Authorization', access_token);
        // },
        success:function(response){
            if (response['result'] == 'success'){
                alert('ADD_POST');
                window.location.href='/board';
            } else {
                alert('Eerror');
            }
        }
    })
}

function updatePost(){
    let access_token = sessionStorage.getItem("token");
    console.log(access_token);

}

function loginCheck(){
    let status = sessionStorage.getItem('token');
    // 로그인 체크하기에 따라 디자인 on/off
    if (status !== null){
        $('#log-in').hide();
        $('#log-out').show();
    } else {
        $('#log-in').show();
        $('#log-out').hide();
    }
}

function logOut(){
    sessionStorage.removeItem('token');
    window.location.reload();
}