FlowRouter.route('/', {
    action() {
        FlowRouter.go("/home");
    }
});

FlowRouter.route('/home', {
    name: 'home',
    action() {
        BlazeLayout.render('MainLayout', {content: 'Home'});
    }
});

FlowRouter.route('/single-recipe/:recipeId', {
    name: 'single-recipe',
    action() {
        BlazeLayout.render('SingleRecipeLayout', {content: 'SingleRecipe'});
    }
});

FlowRouter.route('/edit-recipe/:recipeId', {
    name: 'edit-recipe',
    action() {
        if(Meteor.userId()) {
            BlazeLayout.render('MainLayout', {content: 'EditRecipe'});
        } else{
            FlowRouter.go('/home');
        }
    }
});

FlowRouter.route('/create-recipe', {
    name: 'create-recipe',
    action() {
        BlazeLayout.render('MainLayout', {content: 'CreateRecipe'});
    }
});


FlowRouter.route('/recipe-book', {
    name: 'recipe-book',
    action() {
        BlazeLayout.render('MainLayout', {content: 'AllRecipes'});
    }
});

FlowRouter.route('/shopping-list', {
    name: 'shopping-list',
    action() {
        BlazeLayout.render('MainLayout', {content: 'ShoppingList'});
    }
});

FlowRouter.route('/profile', {
    name: 'profile',
    action() {
        BlazeLayout.render('MainLayout', {content: 'profile'});
    }
});

FlowRouter.route('/inbox', {
    name: 'inbox',
    action() {
        if (Meteor.userId()) {
            BlazeLayout.render('MainLayout', {content: 'inbox'});
        } else{
            FlowRouter.go('/profile');
        }
    }
});

FlowRouter.route('/favorites', {
    name: 'favorites',
    action() {
        if (Meteor.userId()) {
            BlazeLayout.render('MainLayout', {content: 'Favorites'});
        } else{
            BlazeLayout.render('MainLayout', {content: 'Favorites'});
        }
    }
});

FlowRouter.route('/search', {
    name: 'search',
    action() {
        if(Meteor.userId()) {
            BlazeLayout.render('MainLayout', {content: 'Search'});
        } else{
            BlazeLayout.render('MainLayout', {content: 'Search'});
        }
    }
});

FlowRouter.route('/categories', {
    name: 'categories',
    action() {
        if(Meteor.userId()) {
            BlazeLayout.render('MainLayout', {content: 'Categories'});
        } else{
            BlazeLayout.render('MainLayout', {content: 'Categories'});
        }
    }
});

FlowRouter.route('/categories/:categoryName', {
    name: 'categories-single',
    action() {
        BlazeLayout.render('MainLayout', {content: 'SingleCategory'});
    }
});

FlowRouter.route('/friends', {
    name: 'friends',
    action() {
        if(Meteor.userId()) {
            BlazeLayout.render('FriendsLayout', {content: 'friendsActive'});
        } else{
            FlowRouter.go('/home');
        }
    }
});

FlowRouter.route('/sentFriendRequests', {
    name: 'sentFriendRequests',
    action() {
        if(Meteor.userId()) {
            BlazeLayout.render('FriendsLayout', {content: 'sentFriendRequests'});
        } else{
            FlowRouter.go('/home');
        }
    }
});

FlowRouter.route('/receivedFriendRequests', {
    name: 'receivedFriendRequests',
    action() {
        if(Meteor.userId()) {
            BlazeLayout.render('FriendsLayout', {content: 'receivedFriendRequests'});
        } else{
            FlowRouter.go('/home');
        }
    }
});

FlowRouter.route('/user/:userProfileName', {
    name: 'user',
    action() {
        BlazeLayout.render('MainLayout', {content: 'user'});
    }
});

FlowRouter.route('/recipes/:userProfileName', {
    name: 'userRecipes',
    action() {
        BlazeLayout.render('MainLayout', {content: 'userRecipes'});
    }
});

FlowRouter.route('/myRecipes', {
    name: 'myRecipes',
    action() {
        if(Meteor.userId()) {
            BlazeLayout.render('MainLayout', {content: 'myRecipes'});
        } else{
            FlowRouter.go('/home');
        }
    }
});

FlowRouter.route('/404', {
    name: '404',
    action() {
        BlazeLayout.render('MainLayout', {content: '404'});
    }
});

FlowRouter.notFound = {
    action: function() {
        FlowRouter.go('/404');
    }
};