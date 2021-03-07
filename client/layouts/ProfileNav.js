Template.ProfileNav.onCreated(function () {
    Session.set("ready", false);
    this.autorun(() => {
        this.subscribe("users.user.notice");
    })
});

Template.ProfileNav.onRendered(function () {
    this.autorun(() => {
        const ready = this.subscriptionsReady();
        if (ready) {
            Session.set("ready", true);
        }
    })
});

Template.ProfileNav.events({
    "click .profile-nav-info"() {
        // console.log(this._id);
        FlowRouter.go(`/profile`);
    },
    "click .profile-nav-inbox"() {
        // console.log(this._id);
        FlowRouter.go(`/inbox`);
    },
})

Template.ProfileNav.helpers({
    isReady: () => {
        return Session.get("ready");
    },
    getInboxNotice: () => {
        console.log("check inbox notice");
        return Meteor.user()?.notice?.inbox ?? false;
    },
});