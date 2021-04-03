import { Recipes } from '../../imports/api/recipesBase.js';

Template.EditRecipe.onCreated(function() {
    Session.set("ready", false);
    const recipeId = FlowRouter.getParam("recipeId");
    this.subscribe("recipesSingle", recipeId);
    console.log(recipeId);
});

Template.EditRecipe.onRendered(function () {

    this.autorun(() => {
        const ready = this.subscriptionsReady();
        if (ready) {
            Session.set("ready", true);
            setTimeout(() => {
                const recCategory = (Recipes.find().fetch()[0].category).toString();
                $("#inputRecipeCategory").val(recCategory);
            }, 0)
        }
    })
})

Template.EditRecipe.helpers({
    getRecipeAuthor: () => {
        return Recipes.find().fetch()[0].owner===Meteor.userId();
    },
    getSingleRecipe: () => {
        console.log("test");
        return Recipes.find().fetch()[0];
    },
    getInputCategory: (category) => {
        return category===Recipes.find().fetch()[0].category;
    },
    checkIfPrivate: () => {
        return Recipes.find().fetch()[0].private;
    },
    getHours: () => {
        const time = Recipes.find().fetch()[0].time;
        return (Math.floor(time / 60)) || 0;
    },
    getMinutes: () => {
        const time = Recipes.find().fetch()[0].time;
        return (time % 60) || 0;
    },
});

Template.EditRecipe.events({

    "click .add-direction-fields"() {
        if ($(".input-directions").length < 20) {
            $("#inputsDirections").append(`
            <div class="tx-div-before"></div>
            <textarea id="" class="input-directions customInput" name="" rows="7" cols="50" required></textarea>
            `);
        } else {
            Bert.alert('Maximum 20 directions per recipe allowed', 'danger');
        };
    },
    "click .add-ingredient-fields"() {
        if ($(".inputIngridient").length < 25) {
            $("#tableCreateBody").append(`
            <tr>
            <td></td>
            <td><input type="text"  name="" class="input-create inputIngridient" required></td>
            <td><input type="text" name="" class="input-create inputIngridientAmount" required></td>
            <td class="delete-row">&#10006;</td>
            </tr>
            `);
        } else {
            Bert.alert('Maximum 25 ingridients per recipe allowed', 'danger');
        };
    },
    "click .delete-row"(e) {
        $( e.target ).parent().remove();
    },
    "click .cr-clear-image-btn"(e) {
        $( e.target ).parent().html("");
        console.log($( e.target ).parent())
    },
    "click .tx-div-before"(e) {
        $( e.target ).next(".input-directions").remove();
        $( e.target ).remove();
    },
    "click .test"(e) {
        let hours = "" ;
        let mins = "";
        if (+($( "#inputPrepTimeHours" ).val()) || "") {
            hours = $( "#inputPrepTimeHours" ).val() + " hr";
        }
        if (+($( "#inputPrepTimeMins" ).val()) || "") {
            mins = " " + $( "#inputPrepTimeMins" ).val() + " min";
        }
        console.log(hours + mins);

    },
    'submit'(event) {

        // Prevent default browser form submit
        event.preventDefault();

        const checkString = str => typeof str === 'string';
        const checkStringAndNotEmpty = str => typeof str === 'string' && str.trim() !== '';
        const checkNumber = value => typeof value === 'number' && value === value;
        const checkInteger = value => typeof value === 'number' && value === value && value%1 == 0;
        const checkNegative = value => typeof value === 'number' && value === value && value <  0;
        const checkMinMax = (value, min, max) => typeof value === 'number' && value === value && value >= min && value <= max;
        const checkStringLength = (str, min, max) => typeof str === 'string' && str.length >= min && str.length <= max;
        const regexSanitiser = /<script(?:(?!\/\/)(?!\/\*)[^'"]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*(?:\n)|\/\*(?:(?:.|\s))*?\*\/)*?<\/script>/gi;
        const sanitiseString = value => value.replace(regexSanitiser, ' ');

        // GET RECIPE NAME
        const name = $( "#inputRecipeName" ).val();
        if (checkStringLength(name, 3, 95)) {} else {
            Bert.alert('Recipe name must be between 3 and 95 characters', 'danger');
            throw new Meteor.Error("bad-name","Invalid recipe name");
        }

        // GET RECIPE CATEGORY
        const category = $( "#inputRecipeCategory" ).val();

        // GET RECIPE DESCRIPTION
        const description = sanitiseString($( "#inputDescription" ).val());
        if (checkStringLength(description, 15, 750)) {} else {
            Bert.alert('Recipe description must be between 15 and 750 characters', 'danger');
            throw new Meteor.Error("bad-description","Invalid description");
        }

        // GET RECIPE DIRECTIONS
        const directions = [];
        $(".input-directions").each(function(index, element){
            // push all recipe directions into the array
            const directionEntry = $(element).val();
            if (checkStringLength(directionEntry, 5, 1500)) {} else {
                Bert.alert('Recipe direction must be between 5 and 1500 characters', 'danger');
                throw new Meteor.Error("bad-description","Invalid direction");
            }
            directions.push(sanitiseString(directionEntry));
        });

        if (directions < 1) {
            Bert.alert('Please add at least one recipe direction!', 'danger');
            throw new Meteor.Error("error-ingridient", "At least one direction required!");
        } else if (directions > 20) {
            Bert.alert('Please add no more than 20 recipe directions!', 'danger');
            throw new Meteor.Error("error-ingridient", "No more than 20 directions allowed!");
        }

        // GET VIDEO LINK
        let video = $( "#inputVideo" ).val().replace(/\s+/g, '');
        if (checkStringLength(video, 0, 150)) {} else {
            Bert.alert('Recipe video link must be between 0 and 150 characters', 'danger');
            throw new Meteor.Error("bad-link","Invalid video link");
        }
        function getVidId(url) {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = url.match(regExp);
        
            if (match && match[2].length == 11) {
                return match[2];
            } else {
                Bert.alert('Please enter proper YouTube link or leave it blank', 'danger');
                throw new Meteor.Error("bad-link","Not propper YouTube link");
            }
        }
        if (video !== "") {
            const myVidId = getVidId(video);
            if (myVidId) {
                video = "https://www.youtube.com/embed/" + myVidId;
            } else {
                video = "error";
            }
        }

        // GET PREPARATION TIME
        let mins = 0;
        if (+($( "#inputPrepTimeHours" ).val()) > 0) {
            mins = +$( "#inputPrepTimeHours" ).val() * 60;
        }
        if (+($( "#inputPrepTimeMins" ).val()) > 0) {
            mins = mins + +$( "#inputPrepTimeMins" ).val();
        }
        const time = mins;
        if (checkInteger(time) && !checkNegative(time)) { } else {
            Bert.alert('Invalid time value', 'danger');
            throw new Meteor.Error("error-time", "Number must be integer, and zero or positive");
        }
        // CHECK IF RECIPE IS SET AS PRIVATE
        const private = $( "#inputPrivate" ).is(':checked');

        // Push all INGRIDIENT names into array and check for duplicates
        var inputIngridientNames = $('.inputIngridient').map(function() {
            return $(this).val();
        }).toArray();
        const checkForDuplicates = function hasDuplicates(arr) {
            return arr.some( function(item) {
                return arr.indexOf(item) !== arr.lastIndexOf(item);
            });
        }
        if ( checkForDuplicates(inputIngridientNames) ) {
            Bert.alert('There are more occurrences of same ingredient', 'danger');
            throw new Meteor.Error("error-ingridient", "Same ingridient name error");
        }

        // Get all ingridents with their amount
        const ingridients = [];
        const ingridientsAmountAll = $(".inputIngridientAmount");
        $(inputIngridientNames).each(function(index, element){
            // push all ingridients with their amount into the array
            if ( checkStringAndNotEmpty( element ) && checkStringAndNotEmpty( $(ingridientsAmountAll).eq(index).val()) && checkStringLength(element, 2, 30) && checkStringLength($(ingridientsAmountAll).eq(index).val(), 2, 30) ) {
                ingridients.push([element, $(ingridientsAmountAll).eq(index).val()]);
            } else {
                Bert.alert('Ingridient names and quantity must not be empty and must be between 2 and 30 characters!', 'danger');
                throw new Meteor.Error("error-ingridient", "Ingridient must have value");
            }
        });

        // Min 1, max 25 ingridients
        if (ingridients.length < 1) {
            Bert.alert('Please add at least one ingridient!', 'danger');
            throw new Meteor.Error("error-ingridient", "At least one ingridient required!");
        } else if (ingridients.length > 25) {
            Bert.alert('Please add no more than 25 ingridients!', 'danger');
            throw new Meteor.Error("error-ingridient", "No more than 25 ingridients allowed!");
        }

        console.log(ingridients);

        // GET RECIPE IMAGES
        const images = [];
        $(".cr-uploaded-image").each(function(index, element){
            // push all images into the array
            images.push($(element).data("img"));
        });
        if (images.length < 1) {
            Bert.alert('Please add at least one recipe photo!', 'danger');
            throw new Meteor.Error("error-photos", "Please add at least one recipe photo!");
        }


        // CALL RECIPE EDIT METHOD
        Meteor.call('recipes.edit', FlowRouter.getParam("recipeId"), name, category, description, directions, ingridients, images, time, private, video, (err, res) => {
            if (err) {
                Bert.alert(err.reason, 'danger');
            } else {
                if (res.isError) {
                    Bert.alert(res.err.reason, 'danger');
                } else {
                    Bert.alert('Recipe edited successfully', 'success');
                    FlowRouter.go(`/single-recipe/${FlowRouter.getParam("recipeId")}`);
                }
            }
        });
    },
    "click #uploadPhoto"(event) {
        $("#fileInput").click();
    },
});