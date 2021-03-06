import { Recipes } from '../../imports/api/recipesBase.js';
import { Template } from 'meteor/templating'


Template.userRecipes.onCreated(function() {
    
    // Session.set("ready", false);
    Session.set("scrollOn", false);
    Session.set("limit", 12);
    Session.set("skip", 0);
    Session.set("searchArray", "");

    this.autorun(() => {
        const userProfileName = FlowRouter.getParam("userProfileName");
        this.subscribe("userProfile", userProfileName);
        Session.set('userProfileName', userProfileName);

        const limit = Session.get("limit");
        const skip = Session.get("skip");
        const searchArray = Session.get("searchArray");
        this.subscribe('recipesUser', FlowRouter.getParam("userProfileName"), limit, skip, searchArray);
    })
    
});


Template.userRecipes.onRendered(function () {

    let headerElem = $('.behind-search-header');
    let targetElem = $('.home-header-container');
    let topPos = 0;
    hasClass = targetElem.hasClass( "home-header-effect" );

    this.autorun(() => {
        
        const ready = this.subscriptionsReady();

        if(ready) {
            const userId = FlowRouter.getParam("userId");
            Meteor.call('postsOtherUserTotal', FlowRouter.getParam("userProfileName"), Session.get("searchArray"), function(error, result){
                // console.log("REAL total posts:", result);
                Session.set('countTotal', result);
            });

            setTimeout(() => {

            }, 0)
        }
        
        
    })


    setTimeout(() => {
        const searchString = FlowRouter.getQueryParam("search");
        if (searchString && searchString.length > 2) {
            $("#homeHeaderSearch").val(searchString);
            $("#homeHeaderSearch").trigger("keyup");
            $(".home-search-btn").trigger("click");
        }
    }, 0)

    let countDiscovered = 0;

    $(".wrapper").on('scroll', function(e) {

        
        topPos = headerElem.offset().top;

        if (topPos < (-25)) {
            if (!targetElem.hasClass( "home-header-effect" )) {
                targetElem.addClass("home-header-effect");
            }
        } else {
            if (targetElem.hasClass( "home-header-effect" )) {
                targetElem.removeClass("home-header-effect");
            }
        };

            if($(".wrapper").scrollTop() + $(".wrapper").outerHeight(true) > ($(".wrapper").prop('scrollHeight')-200)) {

                countDiscovered =  Session.get("limit") + Session.get("skip");
                if (countDiscovered < Session.get('countTotal')) {
                    Session.set("scrollOn", true);
                    // console.log("trigger");
                    // Session.set("limit", Session.get("limit") + 4);
                    // Session.set("limit", 12);
                    Session.set("skip", Session.get("skip") + 4);
    
                    // console.log("limit+skip=", Session.get("limit")+Session.get("skip"));
                }


                
            } 
            
            if ($(".wrapper").scrollTop() < 5 && Session.get("skip")!==0) {
                Session.set("scrollOn", true);
                $('.wrapper').animate({scrollTop: 30}, 100);
                if (Session.get("skip")<=3) {
                    Session.set("skip", 4);
                } else {
                    Session.set("skip", Session.get("skip") - 4);
                }

            }
            // console.log("posts curently visible: ", Recipes.find().count());

    })



    
});


Template.userRecipes.onDestroyed(function() {

})

Template.userRecipes.helpers({
    isReady: () => {
        return Session.get("ready");
    },
    isScrollOn: () => {
        return Session.get("scrollOn");
    },
    getRecipes: () => {
        return Recipes.find({}, {sort: {createdAt: -1}});
    },
    getSearchCount: () => {
        const countIt = Recipes.find().count();
        if (countIt===0 && Session.get("searchArray").length > 0) {
            Session.set("noSearchResults", true);
        } else if (countIt===0 && Session.get("searchArray").length < 1) {
            Session.set("noSearchResults", false);
        } else {
            Session.set("noSearchResults", false);
        }
        return countIt;
    },
    getNoSearchResultes: () => {
        return Session.get("noSearchResults");
    },
    getSearchVal: () => {
        return Session.get("searchArray");
    },
    getTime: (time) => {
        let hours = (Math.floor(time / 60)) || "";
        if (hours) { hours = hours + " hr"};
        let mins = (time % 60) || "";
        if (mins) { mins = mins + " min"};
        return hours + " " + mins;
    },
    getRaiting: (a) => {
        if (jQuery.isEmptyObject(a)) {
            return 0;
        } else if (a) {
            let sum = 0;
            let count = 0;
            for (const key of Object.keys(a)) {
                sum = sum + a[key];
                count ++;
            }
            const avgStar = sum / count;
            return avgStar;
        } else {
            return 0;
        }
    },
    getUserProfile: () => {
        // console.log(Meteor.users.find({ username: Session.get('userProfileName') }).fetch()[0]);
        return Meteor.users.find({ username: Session.get('userProfileName') }).fetch()[0];
    },
    getCategoryLink: (categoryName) => {
        return "/categories/"+ categoryName.replace(/ /g, '_');
    },
});

Template.userRecipes.events({
    "click .home-recipe-container"() {
        // console.log(this._id);
        FlowRouter.go(`/single-recipe/${this._id}`);
    },
    "click .home-fav-btn"() {
        // console.log(this._id);
        // FlowRouter.go(`/favorites`);
    },
    "click .home-top-btn"() {
        Session.set("limit", 12);
        Session.set("skip", 0);
        $(".wrapper").animate({scrollTop: 0}, 1000);
    },
    'click .icon-clear-search' () {
        $('.home-header-search').val("");
        Session.set("limit", 12);
        Session.set("skip", 0);
        $('.wrapper').animate({scrollTop: 0}, 100);
        $('.home-header-search').trigger('keyup');
    },
    "click .home-search-btn"() {
            $(".home-search-btn").addClass("active");
            $( ".home-header-search" ).trigger('focus');
    },
    'focusout .home-search-btn' () {
        $(".home-search-btn").removeClass("active");
    },
    'click .home-recipe-category' (event) {
        event.stopPropagation();
    },
    'click .btn-clear-search' () {
        $('.home-header-search').val("");
        Session.set("limit", 12);
        Session.set("skip", 0);
        $('.wrapper').animate({scrollTop: 0}, 100);
        $('.home-header-search').trigger('keyup');
    },
    'keyup .home-header-search' (event) {
        if (event.keyCode !== 32) {
            const inputValue = $(event.currentTarget).val().toLowerCase().split(" ");
            var cleanArray = inputValue.filter(function(x) {
                return x.length > 2
            });
            if(inputValue.length > 2 && Meteor.user()) {
                Session.set("limit", 12);
                Session.set("skip", 0);
                $('.wrapper').animate({scrollTop: 0}, 100);
                $(window).scrollTop();
            }
            Session.set("searchArray", cleanArray);
            $('.wrapper').animate({scrollTop: 0}, 0);
            // console.log(cleanArray);
        }
    },
});
