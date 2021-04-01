Template.signInUp.helpers({
    isRegister: () => {
        return Session.get('registerPage');
    },
});

Template.signInUp.events({
    "click #registerLink"() {
        Session.set('registerPage', true);
    },
    "click #logInLink"() {
        Session.set('registerPage', false);
    },
});