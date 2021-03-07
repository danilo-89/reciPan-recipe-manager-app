import { Recipes } from '../../imports/api/recipesBase.js';


Template.Favorites.onCreated(function () {

    Session.set("ready", false);
    Session.set("scrollOn", false);
    Session.set("limit", 12);
    Session.set("searchArray", "");


    this.autorun(() => {
        const limit = Session.get("limit");
        const searchArray = Session.get("searchArray");
        this.subscribe('recipesFav', limit, searchArray);

        Meteor.call('getUserFavoritesCount', (err, res) => {
            if (err) {
                console.log(err);
            } else {
                Session.set('userFavoritesCount', res);
                console.log(res, "this is ok");
            }
        })
    })
    


});


Template.Favorites.onRendered(function () {

    let headerElem = $('.behind-search-header');
    let targetElem = $('.home-header-container');
    let topPos = 0;
    hasClass = targetElem.hasClass( "home-header-effect" );


    this.autorun(() => {
        const ready = this.subscriptionsReady();
        if (ready) {
            Session.set("ready", true);
        }
    });

    $(".wrapper").on('scroll', function(e) {
        // console.log(topPos, "element position");
         // console.log($('.behind-search-header').outerHeight(), "element height");
         
        topPos = headerElem.offset().top;

        if (topPos < (-25)) {
            if (!targetElem.hasClass( "home-header-effect" )) {
                console.log("set it");
                targetElem.addClass("home-header-effect");
            }
        } else {
            if (targetElem.hasClass( "home-header-effect" )) {
                targetElem.removeClass("home-header-effect");
            }
        };


            // console.log("position:", $(".wrapper").scrollTop());
            // console.log("height:", $(".wrapper").outerHeight(true));
            // console.log("total:", $(".wrapper").prop('scrollHeight'));

            console.log(
                (
                    $(".wrapper").prop('scrollHeight')
                ), 
                (
                    $(".wrapper").scrollTop() + $(".wrapper").outerHeight(true)
                )
            );

            if($(".wrapper").scrollTop() + $(".wrapper").outerHeight(true) > ($(".wrapper").prop('scrollHeight')-100)) {
                Session.set("scrollOn", true);
                console.log("trigger");
                Session.set("limit", Session.get("limit") + 4);
            }
            
            // if($(".wrapper").scrollTop() + $(".wrapper").height() == window.innerHeight-200) {
            //     alert("bottom!");
            // }
       

        // if ($('#box-in-shadow').scrollTop() + $(window).height() > $('#box-in-shadow > div').height() + 96) {
        //     // show spinner
        //     const spinnerWrapper = document.querySelector(".pag-spinner-blue");
        //     spinnerWrapper.style.display = "block";
        //     Session.set("clubPostsLimit", Session.get("clubPostsLimit") + 6); // when it reaches the end, add another 9 elements
        // }
    })


});





Template.Favorites.helpers({
    isReady: () => {
        return Session.get("ready");
    },
    isScrollOn: () => {
        return Session.get("scrollOn");
    },
    getRecipes: () => {
        return Recipes.find({}, {sort: {createdAt: -1}});
    },
    getSearchCount: function() {
        const countIt = Recipes.find().count();
        if (countIt===0) {
            Session.set("noSearchResults", true);
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
        if (a) {
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
    getUserFavoritesCount: () => {
        return Object.keys(Session.get('userFavoritesCount')).length;
    }
    // replaceSpaceWithUnderscore: (e) => {
    //     return e.split(' ').join('_');
    // },
    // returnSector: () => {
    //     return FlowRouter.getQueryParam('sector');
    // },
    // getSector: (btnSector, flowSector) => {
    //     if(btnSector === flowSector) {
    //         return 'btn-shc-active';
    //     } else {
    //         return;
    //     }
    // }

});


Template.Favorites.events({
    "click .home-recipe-container"() {
        // console.log(this._id);
        FlowRouter.go(`/single-recipe/${this._id}`);
    },
    "click .home-fav-btn"() {
        // console.log(this._id);
        FlowRouter.go(`/favorites`);
    },
    "click .home-top-btn"() {
        $(".wrapper").animate({scrollTop: 0}, 1000);
    },
    'click .icon-clear-search' () {
        console.log("wiiiiiiiiiiiiiiiiiiii")
        $('.home-header-search').val("");
        $('.home-header-search').keyup();
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
        $('.home-header-search').keyup();
    },
    'keyup .home-header-search' (event) {
        if (event.keyCode !== 32) {
            const inputValue = $(event.currentTarget).val().toLowerCase().split(" ");
            var cleanArray = inputValue.filter(function(x) {
                return x.length > 2
            });

            // cleanArray = cleanArray.map( function( val ){ 
            //     return new RegExp(val); 
            // });

            Session.set("searchArray", cleanArray);
            // Session.set("noSearchResults", true);
            console.log(cleanArray);
        }
    },
});

// "click .on-club-post"() {
//     FlowRouter.go(`/clubMy/${this._id}`);
// },