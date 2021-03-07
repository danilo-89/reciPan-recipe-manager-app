import { Template }    from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Images from '/lib/dropbox.js';

Template.uploadForm.onCreated(function () {

  this.currentUpload = new ReactiveVar(false);

  // this.autorun(() => {
  //   this.subscribe('files.images.all');
  // })

});

Template.uploadForm.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  }
});

Template.uploadForm.events({



  
  'change #fileInput'(e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // multiple files were selected






      
      const upload = Images.files.insert({
        file: e.currentTarget.files[0],
        chunkSize: 'dynamic'
      }, false);

      upload.on('start', function () {
        template.currentUpload.set(this);
      });

      upload.on('end', function (error, fileObj) {
        if (error) {
          alert(`Error during upload: ${error}`);
        } else {
          alert(`File "${fileObj.name}" successfully uploaded`);

          if ($("#crImg1 > .cr-uploaded-image").length === 0) {
            $("#crImg1").html(`
            <div class="cr-uploaded-image" style="background-image: url('${getImgLink(fileObj)}');" data-img="${getImgLink(fileObj)}"></div><span class="cr-clear-image-btn">X</span>
            `);
          } else if ($("#crImg2 > .cr-uploaded-image").length === 0) {
            $("#crImg2").html(`
            <div class="cr-uploaded-image" style="background-image: url('${getImgLink(fileObj)}');" data-img="${getImgLink(fileObj)}"></div><span class="cr-clear-image-btn">X</span>
            `);
          } else {
            $("#crImg3").html(`
            <div class="cr-uploaded-image" style="background-image: url('${getImgLink(fileObj)}');" data-img="${getImgLink(fileObj)}"></div><span class="cr-clear-image-btn">X</span>
            `);
          }


        }
        template.currentUpload.set(false);
      });
      upload.start();
    }
  }

});

function getImgLink(img) {
  let getFirstPart = Meteor.absoluteUrl();
  if (getFirstPart.charAt(getFirstPart.length - 1) === "/") {
    getFirstPart = getFirstPart.slice(0, -1);
  }
  return `..${img._downloadRoute}/${img._collectionName}/${img._id}/original/${img._id}.${img.extension}`;
}