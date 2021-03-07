
// import 'materialize-css/dist/css/materialize.css'
import { Recipes } from '../../imports/api/recipesBase.js';
import '../../imports/startup/accounts-config.js';


// Template.CreateRecipe.onRendered(function () {
   
// })

Template.CreateRecipe.onDestroyed( function(event) {
    // confirm("54645654");
    // event.preventDefault();
    
});




Template.CreateRecipe.events({
    'submit'(event) {

        // Prevent default browser form submit
        event.preventDefault();

        // GET RECIPE NAME
        const name = $( "#inputRecipeName" ).val();

        // GET RECIPE CATEGORY
        const category = $( "#inputRecipeCategory" ).val();

        // GET RECIPE DESCRIPTION
        const description = $( "#inputDescription" ).val();

        // GET VIDEO LINK
        let video = $( "#inputVideo" ).val().replace(/\s+/g, '');
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
        
        // GET PREPARATION TIME
        let mins = 0;
        if (+($( "#inputPrepTimeHours" ).val()) > 0) {
            mins = +$( "#inputPrepTimeHours" ).val() * 60;
        }
        if (+($( "#inputPrepTimeMins" ).val()) > 0) {
            mins = mins + +$( "#inputPrepTimeMins" ).val();
        }
        const time = mins;

        // CHECK IF RECIPE IS SET AS PRIVATE
        const private = $( "#inputPrivate" ).is(':checked');

        // Get all directions with their amount
        const directions = [];
        $(".input-directions").each(function(index, element){
            // push all ingridients with their amount into the array
            directions.push($(element).val());
        });

        // Get all ingridents with their amount
        const ingridients = [];
        const ingridientsAmountAll = $(".inputIngridientAmount");
        $(".inputIngridient").each(function(index, element){
            // push all ingridients with their amount into the array
            ingridients.push([$(element).val(), $(ingridientsAmountAll).eq(index).val()]);
        });
    
        // CALL RECIPE CREATION METHOD
        Meteor.call('recipes.insert', name, category, description, directions, ingridients, images, time, private, video, (err, res) => {
            if (err) {
                Bert.alert(err.reason, 'danger');
            } else {
                if (res.isError) {
                    Bert.alert(res.err.reason, 'danger');
                } else {
                    Bert.alert('Recipe posted successfully', 'success');
                }
            }
        });

        console.log("posting successful")
        // Clear form
        // target.text.value = '';
    },
    "click .add-direction-fields"() {
        $("#inputsDirections").append(`
        <div class="tx-div-before"></div>
        <textarea id="" class="input-directions customInput" name="" rows="7" cols="50"></textarea>
        `);
    },
    "click .add-ingredient-fields"() {
        $("#tableCreateBody").append(`
        <tr>
        <td></td>
        <td><input type="text"  name="" class="input-create inputIngridient"></td>
        <td><input type="text" name="" class="input-create inputIngridientAmount"></td>
        <td class="delete-row">&#10006;</td>
        </tr>
        `);
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
});


// window.addEventListener('beforeunload', function (e) {
//     alert("test");
// })

