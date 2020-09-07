const $ = require('jquery');
const stopVideo = jest.fn()

function clean(canvas,image) {
    imageUpload.value='';
    $("#imageUpload").hide();
    $("#video").hide();
    $(".video-controls").hide();
    if (canvas) canvas.remove();
    if (image) image.remove();
    stopVideo();
}

function loadingComplete() {
    $(".loader-wrapper").fadeOut("slow");
    $(".loader-wrapper").remove();
}

module.exports = {clean, loadingComplete};