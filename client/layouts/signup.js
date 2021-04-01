Template.signup.events({
    'submit form' ( event, template ) {
      event.preventDefault();
      
      let user = {
        username: template.find( '[name="userName"]' ).value,
        // email: template.find( '[name="emailAddress"]' ).value,
        password: template.find( '[name="password"]' ).value
      };
  
      Accounts.createUser( user, ( error ) => {
        if ( error ) {
          Bert.alert( error.reason, 'danger' );
        } else {
          Accounts.createUser({
            username,
            password
        });
        }
      });
    },
    'keyup #inputPassword' ( event, template ) {
      validatePassword()
    },
    'keyup #inputRepeatPassword' ( event, template ) {
      validatePassword()
    },
    'click button' ( event, template ) {
      event.preventDefault();
      
          Meteor.call( 'sendVerificationLink', ( error, response ) => {
            if ( error ) {
              Bert.alert( error.reason, 'danger' );
            } else {
              Bert.alert( 'Welcome!', 'success' );
            }
          });
    }
  });


  function validatePassword(){
    var password = document.getElementById("inputPassword")
  , confirm_password = document.getElementById("inputRepeatPassword");
    if(password.value != confirm_password.value) {
      confirm_password.setCustomValidity("Passwords Don't Match");
    } else {
      confirm_password.setCustomValidity('');
    }
  }