Template.modal.helpers({
    modalData: function() {
        return Session.get('modalData')
    },
});


Template.modalBlock.helpers({

});

Template.modal.events({

    "click .modal-dialog"(event) {
        event.stopPropagation();
    },
    "click #myModal"(event) {
        Session.set('modalData', null);
        // console.log(event.currentTarget);
        // if(event.currentTarget == document.getElementById('myModal')) {
        //     console.log(event.currentTarget);
            
        // }
    },
    "click .soc-link"(event) {
        var copyText = document.getElementById('addressLinkInput');
        copyText.select();
        copyText.setSelectionRange(0, 99999)
        document.execCommand("copy");
        Bert.alert( 'Recipe link copied to clipboard', 'success', 'fixed-top', 'fas fa-link' );
    },
    "click .share-in-app-btn"(event) {
        console.log( Session.get('recipeId') + "_" + Date.now() + "_" + Meteor.userId());
        const userName = document.getElementById('friendUsernameInput').value;
        if(!userName) {
            Bert.alert("Please enter a valid username!", 'danger');
        } else if (userName===Meteor.user().username) {
            Bert.alert("You can't send recipe to yourself, but you can favorite it instead!", 'danger');
        } else {
            Meteor.call('share.recipe', Session.get('recipeId'), Session.get('modalData').recipeName, userName, (err, res) => {
                if (err) {
                    Bert.alert(err.reason, 'danger');
                } else {
                    if (res.isError) {
                        Bert.alert(res.err.reason, 'danger');
                    } else {
                        Bert.alert('Recipe shared', 'success');
                    }
                }
            });
        }
        Session.set('modalData', null);
    },
})
