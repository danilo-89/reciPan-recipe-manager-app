import { Recipes } from '../../imports/api/recipesBase.js';


Template.SingleCategory.onCreated(function () {

    Session.set("ready", false);
    Session.set("scrollOn", false);
    Session.set("limit", 12);
    Session.set("skip", 0);
    Session.set("searchArray", "");
    Session.set("noSearchResults", null);

    this.autorun(() => {
        const limit = Session.get("limit");
        const skip = Session.get("skip");
        const searchArray = Session.get("searchArray");
        const categoryName = FlowRouter.getParam("categoryName");
        this.subscribe('recipesForCategory', categoryName, limit, skip, searchArray);
    })
    
});


Template.SingleCategory.onRendered(function () {

    let headerElem = $('.behind-search-header');
    let targetElem = $('.home-header-container');
    let topPos = 0;
    hasClass = targetElem.hasClass( "home-header-effect" );
    Session.set("noSearchResults", null);

    this.autorun(() => {
        const ready = this.subscriptionsReady();
        if (ready) {
            Session.set("ready", true);
        }

    });


    setTimeout(() => {
        // $(".home-search-btn").trigger("click");
    }, 0)

    let countTotal = 0;
    let countDiscovered = 0;

    Meteor.call('postsCategoryTotal', FlowRouter.getParam("categoryName"), function(error, result){
        console.log("REAL total posts:", result);
        countTotal = result;
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

            // console.log(
            //     (
            //         $(".wrapper").prop('scrollHeight')
            //     ), 
            //     (
            //         $(".wrapper").scrollTop() + $(".wrapper").outerHeight(true)
            //     )
            // );

            if($(".wrapper").scrollTop() + $(".wrapper").outerHeight(true) > ($(".wrapper").prop('scrollHeight')-200)) {

                


                countDiscovered =  Session.get("limit") + Session.get("skip");
                if (countDiscovered<countTotal) {
                    Session.set("scrollOn", true);
                    console.log("trigger");
                    // Session.set("limit", Session.get("limit") + 4);
                    // Session.set("limit", 12);
                    Session.set("skip", Session.get("skip") + 4);
    
                    console.log("limit+skip=", Session.get("limit")+Session.get("skip"));
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
            console.log("posts curently visible: ", Recipes.find().count());
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





Template.SingleCategory.helpers({
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
    getCategoryName: () => {
        return FlowRouter.getParam("categoryName").replace(/_/g, ' ');
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


Template.SingleCategory.events({
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
        console.log("wiiiiiiiiiiiiiiiiiiii")
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
    // 'click .home-recipe-category' (event) {
    //     event.stopPropagation();
    // },
    'click .btn-clear-search' () {
        $('.home-header-search').val("");
        Session.set("limit", 12);
        Session.set("skip", 0);
        $('.wrapper').animate({scrollTop: 0}, 100);
        $('.home-header-search').trigger('keyup');
    },
    "click .home-logo-img"() {
        FlowRouter.go(`/home`);
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
            if(inputValue.length > 2) {
                Session.set("limit", 12);
                Session.set("skip", 0);
                $('.wrapper').animate({scrollTop: 0}, 100);
                $(window).scrollTop();
            }


            Session.set("searchArray", cleanArray);
            $('.wrapper').animate({scrollTop: 0}, 0);
            // Session.set("noSearchResults", true);
            console.log(cleanArray);
        }
    },
});

// "click .on-club-post"() {
//     FlowRouter.go(`/clubMy/${this._id}`);
// },