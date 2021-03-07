import { Template }    from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Images from '/lib/dropbox.js';

Template.uploadedFiles.onCreated(function () {

  this.autorun(() => {
    // this.subscribe('files.images.all');
  })

});

Template.uploadedFiles.helpers({
    // uploadedFiles: function () {
    //   return Images.files.find();
    // }
});


