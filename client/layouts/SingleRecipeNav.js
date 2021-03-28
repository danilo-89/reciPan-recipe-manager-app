import { Recipes } from '../../imports/api/recipesBase.js';

Template.SingleRecipeNav.onCreated(function () {})


Template.SingleRecipeNav.onRendered(function() {})


Template.SingleRecipeNav.helpers({
    getSingleRecipe: () => {
        return Recipes.find().fetch()[0];
    },
})


Template.SingleRecipeNav.events({
    "click a"(event) {   
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

    },
})