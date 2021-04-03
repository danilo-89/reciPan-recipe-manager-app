Template.sentFriendRequests.onCreated(function () {

    this.autorun(() => {
        this.subscribe('users.friendsSent');
        this.subscribe('friends.friendsSent');
    })

    
});

Template.sentFriendRequests.events({
    "click .withdraw-friend-request-btn"(event) {
        event.stopPropagation();

        Meteor.call('removeFromSent', this.valueOf(), (err, res) => {
            if (err) {
                Bert.alert(err.reason, 'danger');
            } else {
                if (res.isError) {
                    Bert.alert(res.err.reason, 'danger');
                } else {
                    Bert.alert('Sent friend request withdrawn', 'success');
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


Template.sentFriendRequests.helpers({
    getFriends: () => {
        return Meteor.user().public?.friends?.sent ?? false;
    },
    getFriendsCount: () => {
        return Meteor.user().public?.friends?.sent.length;
    },
    getFriendsNames: (friendId) => {
        return Meteor.users.findOne({_id: friendId}).username;
    },
    getFriendsAvatar: (friendId) => {
        return Meteor.users.findOne({_id: friendId}).profile?.profilePhotoUrl;
    },
    // getContactName: (contactObj) => {
    //     return Object.getOwnPropertyNames(contactObj)[0];
    // },
})