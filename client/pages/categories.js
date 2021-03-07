import { Recipes } from '../../imports/api/recipesBase.js';


Template.Categories.onCreated(function () {

    Session.set("ready", false);
    Session.set("scrollOn", false);
    Session.set("limit", 12);
    Session.set("searchArray", "");


    this.autorun(() => {
        const limit = Session.get("limit");
        const searchArray = Session.get("searchArray");
        this.subscribe('recipesFav', limit, searchArray);

        Meteor.call('getCategoryImg', (err, res) => {
            if (err) {
                console.log(err);
            } else {
                Session.set('catImages', res);
                console.log(res, "this is ok");
            }
        })
    })
    


});


Template.Categories.onRendered(function () {

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


});





Template.Categories.helpers({
    isReady: () => {
        return Session.get("ready");
    },
    isScrollOn: () => {
        return Session.get("scrollOn");
    },
    getRecipes: () => {
        return Recipes.find({}, {sort: {createdAt: -1}});
    },
    getCatImg: (cat) => {

        Session.get('catImages');
        return Session.get('catImages')[cat]||"/logo-img-holder.svg";
        
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


Template.Categories.events({
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
    'click .category-card-wrapper' (event) {
        const sCat = $(event.currentTarget).attr("data-category");
        FlowRouter.go(`/categories/` + sCat);
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