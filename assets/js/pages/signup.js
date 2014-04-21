$("#signup input[name='submit']").click(function() {
    var email = $("#signup input[name='email'] ").val();
    var password = $("#signup input[name='password'] ").val();
    var displayname = $("#signup input[name='displayname'] ").val();

    $.post(
        '/signup', {
            email: email,
            password: password,
            displayname: displayname
        },
        function(user) {
            console.log(user);
            window.location = "/"; //success redirect
        }
    ).fail(function(res) {
        console.log(res.responseJSON);
    });
});