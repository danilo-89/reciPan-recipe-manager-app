FlowRouter.route('/', {
    action() {
        FlowRouter.go("/home");
        // BlazeLayout.render('HomeLayout');
        // FlowRouter.go("/recipe-book");
    }
});

FlowRouter.route('/home', {
    name: 'home',
    action() {
        BlazeLayout.render('MainLayout', {content: 'Home'});
        // BlazeLayout.render('HomeLayout');
        // FlowRouter.go("/recipe-book");
    }
});

FlowRouter.route('/single-recipe/:recipeId', {
    name: 'single-recipe',
    action() {
        BlazeLayout.render('SingleRecipeLayout', {content: 'SingleRecipe'});
        // BlazeLayout.render('HomeLayout');
        // FlowRouter.go("/recipe-book");
    }
});

FlowRouter.route('/edit-recipe/:recipeId', {
    name: 'edit-recipe',
    action() {
        if(Meteor.userId()) {
            BlazeLayout.render('MainLayout', {content: 'EditRecipe'});
        } else{
            BlazeLayout.render('MainLayout', {content: 'Home'});
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
        BlazeLayout.render('MainLayout', {content: 'inbox'});
    }
});

FlowRouter.route('/favorites', {
    name: 'favorites',
    action() {
        if(Meteor.userId()) {
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
        // BlazeLayout.render('HomeLayout');
        // FlowRouter.go("/recipe-book");
    }
});

FlowRouter.route('/friends', {
    name: 'friends',
    action() {
        BlazeLayout.render('FriendsLayout', {content: 'friendsActive'});
        // BlazeLayout.render('HomeLayout');
        // FlowRouter.go("/recipe-book");
    }
});

FlowRouter.route('/sentFriendRequests', {
    name: 'sentFriendRequests',
    action() {
        BlazeLayout.render('FriendsLayout', {content: 'sentFriendRequests'});
        // BlazeLayout.render('HomeLayout');
        // FlowRouter.go("/recipe-book");
    }
});

FlowRouter.route('/receivedFriendRequests', {
    name: 'receivedFriendRequests',
    action() {
        BlazeLayout.render('FriendsLayout', {content: 'receivedFriendRequests'});
        // BlazeLayout.render('HomeLayout');
        // FlowRouter.go("/recipe-book");
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
            BlazeLayout.render('MainLayout', {content: 'myRecipes'});
        }
    }
});