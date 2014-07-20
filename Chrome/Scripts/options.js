$(function() {
    $('#save').click(function() {
        var basicAuth = btoa($('#username').val() + ':' + $('#password').val());
        localStorage.setItem('Auth', basicAuth);
        alert('Saved successfully');
    });
});