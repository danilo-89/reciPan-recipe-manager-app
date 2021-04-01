Template.signin.events({

    "submit form"(event) {
        event.preventDefault();

        const name = $('#inputUserName').val();
        const password = $('#inputPassword').val();

        if(name && password) {
            Meteor.loginWithPassword(name, password, err => {
                if(err) {
                    if (err.reason == 'User not found') {
                        Bert.alert('User not found', 'danger');
                    } else if (err.reason == 'Incorrect password') {
                        Bert.alert('Wrong password', 'danger');
                    } else {
                        Bert.alert(err.reason, 'danger');
                    }
                } else {
                    Bert.alert('You have successfully logged in', 'success');
                }
            })
        } else {}
    },

})