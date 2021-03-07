BlazeLayout.setRoot('body');
// import fontawesome
import '@fortawesome/fontawesome-free/js/all.js';

Template.Footer.onCreated(function() {
    Session.set("ready", false);
    this.autorun(() => {
        this.subscribe("users.user.notice");
    })
});

Template.Footer.onRendered(function () {
    this.autorun(() => {
        const ready = this.subscriptionsReady();
        if (ready) {
            Session.set("ready", true);
        }
    })
});






Template.Footer.helpers({
    isReady: () => {
        return Session.get("ready");
    },
    getNotice: () => {
        console.log('check notice');
        const noticeObj = Meteor.user().notice;
        for (const property in noticeObj) {
            if(noticeObj[property]) {
                return true;
            }
        }
        return false;
    },
});

Template.Footer.events({
    // "click .li-nav-home"() {
    //     FlowRouter.go("/home");
    // },
    // "click .li-nav-shlist"() {
    //     FlowRouter.go("/shopping-list");
    // }
});
