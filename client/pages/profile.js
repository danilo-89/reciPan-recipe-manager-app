Template.profile.onCreated(function () {
    Session.set("ready", false);
    this.autorun(() => {
        // this.subscribe('usersConfirmation.user');
        this.subscribe('users.user');
        this.subscribe("users.user.notice");
    })
});

Template.profile.onRendered(function () {

    this.autorun(() => {
        const ready = this.subscriptionsReady();
        if (ready) {
            Session.set("ready", true);
            Meteor.call('getUserFavoritesCount', (err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    Session.set('userFavoritesCount', res);
                }
            });
            Meteor.call('getUserPostsTotal', (err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    Session.set('userRecipesCount', res);
                }
            })
        }
    })

});

Template.profile.helpers({
    isReady: () => {
        return Session.get("ready");
    },
    userName: () => {
        return Meteor.user().username;
    },
    getAvatarImg: () => {
        return Meteor.user().profile.profilePhotoUrl;
    },
    getFriendsActiveCount: () => {
        if (Meteor.user().public.friends.active) {
            return Meteor.user().public.friends.active.length;
        } else {
            return "0";
        }
    },
    getUserFavoritesCount: () => {
        if (Session.get('userFavoritesCount')) {
            return Object.keys(Session.get('userFavoritesCount')).length;
        } else {
            return 0;
        }
    },
    getUserRecipesCount: () => {
        return Session.get('userRecipesCount');
    },
    getInboxNotice: () => {
        return Meteor.user().notice.inbox;
    },
    getFriendNotice: () => {
        console.log("check friend notice");
        return Meteor.user().notice.friendAccept || Meteor.user().notice.friendRequest;
    },
});

Template.profile.events({
    "click .friends-info-btn"() {
        // console.log(this._id);
        FlowRouter.go(`/friends`);
    },
});

