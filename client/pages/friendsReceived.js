Template.receivedFriendRequests.onCreated(function () {
    this.autorun(() => {
        this.subscribe('users.friendsReceived');
        this.subscribe('friends.friendsReceived');
    })
});

Template.receivedFriendRequests.onRendered(function () {

    this.autorun(() => {
        const ready = this.subscriptionsReady();
        if (ready) {
            if (Meteor.user().notice?.friendRequest) {
                Meteor.call('read.received', (err, res) => {
                    if (err) {
                        Bert.alert(err.reason, 'danger');
                    } else {
                        if (res.isError) {
                            Bert.alert(res.err.reason, 'danger');
                        } else {}
                    }
                });
            }
        }
    });

});

Template.receivedFriendRequests.events({
    "click .accept-friend-request-btn"(event) {
        event.stopPropagation();
        console.log(this);
        // FlowRouter.go(`/edit-recipe/${this._id}`);
        Meteor.call('acceptFriendRequest', this.valueOf(), (err, res) => {
            if (err) {
                Bert.alert(err.reason, 'danger');
            } else {
                if (res.isError) {
                    Bert.alert(res.err.reason, 'danger');
                } else {
                    Bert.alert('Friend request accepted', 'success');
                }
            }
        })
    },
    "click .userNameLink"(event) {
        const userProfileName = Meteor.users.findOne({_id: this.toString()}).username;
        if (Meteor.user()?.username === userProfileName) {
            FlowRouter.go('/profile');
        } else {
            FlowRouter.go(`/user/${userProfileName}`);
        }
    },
});

Template.receivedFriendRequests.helpers({
    getFriends: () => {
        return Meteor.user().public?.friends?.received ?? false;
    },
    getFriendsCount: () => {
        return Meteor.user().public?.friends?.received.length;
      },
    getFriendsNames: (friendId) => {
        return Meteor.users.findOne({_id: friendId}).username;
    },
    getFriendsAvatar: (friendId) => {
        return Meteor.users.findOne({_id: friendId}).profile?.profilePhotoUrl;
    },
})