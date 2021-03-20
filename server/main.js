import { Meteor } from 'meteor/meteor';
import '../imports/api/recipesBase.js';
import { Accounts } from 'meteor/accounts-base';

const checkUNRegex = /^(\d|\w)+$/ ;


Meteor.startup(() => {
  // code to run on server at startup
});

Accounts.validateNewUser((user) => {
  if ( user.username && user.username.length >= 3 && user.username.length <=20 && checkUNRegex.test(user.username) ) {
    return true;
  } else if (checkUNRegex.test(user.username) === false) {
    console.log('Username can only consist of letters, numbers and underscores');
    throw new Meteor.Error(403, 'Username can only consist of letters, numbers and underscores');
  } else {
    console.log('Username must be between 3 and 20 characters');
    throw new Meteor.Error(403, 'Username must be between 3 and 20 characters');
  }
});