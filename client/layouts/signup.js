Template.signup.events({
    'submit form' ( event, template ) {
      event.preventDefault();
      
      let user = {
        username: template.find( '[name="userName"]' ).value,
        email: template.find( '[name="emailAddress"]' ).value,
        password: template.find( '[name="password"]' ).value
      };
  
      Accounts.createUser( user, ( error ) => {
        if ( error ) {
          Bert.alert( error.reason, 'danger' );
        } else {
          Meteor.call( 'sendVerificationLink', ( error, response ) => {
            if ( error ) {
              Bert.alert( error.reason, 'danger' );
            } else {
              Bert.alert( 'Welcome!', 'success' );
            }
          });
        }
      });
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