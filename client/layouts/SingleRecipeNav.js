import { Recipes } from '../../imports/api/recipesBase.js';

Template.SingleRecipeNav.onCreated(function () {
    // $(window).on('scroll', function(e) {
    //     // ... event processing stuff; 
    //     // say it produces value 'zoomAmount' ...
    //     console.log("scrolling mad...");
    })

    // this.autorun(() => {

        // setTimeout(() => {
        //     console.log("teteterter");
        //     $(window).on('scroll', function(e) {
        //         // ... event processing stuff; 
        //         // say it produces value 'zoomAmount' ...
        //         console.log("scrolling mad...");
        //     })
        // }, 0)
        // $('.wrapper').on('scroll', function() {
        //     console.log("testing scroll detect");
        //     var scrollTop = $(this).scrollTop();
        //     if (scrollTop + $(this).innerHeight() >= this.scrollHeight) {
        //       $('#message').text('end reached');
        //     } else if (scrollTop <= 0) {
        //       $('#message').text('Top reached');
        //     } else {
        //       $('#message').text('');
        //     }
        // });

    // })
    
// });

Template.SingleRecipeNav.onRendered(function(){
    // You can do this multiple times
    // $(".wrapper").on('scroll', function(e) {
    //     console.log($('#sRInfo').offset().top - 36, "pozicija");
    //     console.log($('#sRInfo').outerHeight(), "visina");
    // })
    // loadEvents();
})

// $('.wrapper').on('scroll', function() {
//     console.log("testing scroll detect");
//     var scrollTop = $(this).scrollTop();
//     if (scrollTop + $(this).innerHeight() >= this.scrollHeight) {
//       $('#message').text('end reached');
//     } else if (scrollTop <= 0) {
//       $('#message').text('Top reached');
//     } else {
//       $('#message').text('');
//     }
// });

Template.SingleRecipeNav.helpers({
    getSingleRecipe: () => {
        return Recipes.find().fetch()[0];
    },
})


Template.SingleRecipeNav.events({
    "click a"(event) {

        // get clicked element
        // console.log(event.currentTarget);
        
        event.preventDefault();

        const hrefOfClicked = $(event.currentTarget).attr("href");
        idTarget = hrefOfClicked.substring(1);

        // Smooth scrolling inside elementusing jQuery easing
        let scrollFunction = function(idstring) {
            $('.wrapper').animate({
                scrollTop: $(idstring).offset().top + $('.wrapper').scrollTop() - 46
            }, 700);
        };

        // Check if element exists
        if ($(hrefOfClicked).length) {
            // first scroll and then add animation
            const promise1 = new Promise((resolve, reject) => {
                scrollFunction(hrefOfClicked);
                setTimeout(() => resolve(), 1000);
            });
            
            promise1.then(
                () => {
                    // console.log("it works");
                    $(hrefOfClicked).removeClass("active");
                    void document.getElementById(idTarget).offsetWidth;
                    $(hrefOfClicked).addClass("active");
                    console.log("slide success");
                },
                error => console.log(error) // doesn't run
            );
        }



        // scrollFunction('#sRInfo');
        // $('#sRInfo').removeClass("active");
        // void document.getElementById("sRInfo").offsetWidth;
        // $('#sRInfo').addClass("active");


    },
})