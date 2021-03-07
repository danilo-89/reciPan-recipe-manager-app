Template.FriendshipTabs.onCreated(function () {
  Session.set("ready", false);
  this.autorun(() => {

  });
});

Template.FriendshipTabs.onRendered(function () {
  this.autorun(() => {
    const ready = this.subscriptionsReady();
    if (ready) {
      Session.set("ready", true);
    }
  });
});

Template.FriendshipTabs.helpers({
    isReady: () => {
        return Session.get("ready");
    },
    getFriendRequestNotice: () => {
        return Meteor.user().notice.friendRequest;
    },
    getFriendAcceptNotice: () => {
        return Meteor.user().notice.friendAccept;
    },
});
