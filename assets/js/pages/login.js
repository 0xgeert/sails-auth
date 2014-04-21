$("#login input[name='submit']").click(function() {
    var email = $("#login input[name='email'] ").val();
    var password = $("#login input[name='password'] ").val();

    $.post(
        '/login', {
            email: email,
            password: password
        },
        function() {
            window.location = "/"; //success redirect
        }
    ).fail(function(res) {
        //if 'msg' found display
        console.log(res.responseJSON);
    });
});