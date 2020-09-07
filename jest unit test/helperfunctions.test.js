const functions = require('./helperfunctions-mock')
const $ = require('jquery');


test('if loadingComplete() removes loader-wrapper', () => {
     // Set up our document body
    document.body.innerHTML =
        '<div class="loader-wrapper">' +
            '<div class="loader"></div>' +
        '</div>';

    functions.loadingComplete()
    expect(document.body.innerHTML).toEqual('')
})

test('if clean() removes canvas and image', () => {
    // Set up our document body
    document.body.innerHTML =
        '<div id="content">'+
            '<input type="file" id="imageUpload">'+
            '<div id="container">'+
                '<video id="video"></video>'+
            '</div>'+
            '<div class="video-controls">'+
            '</div>'+
        '</div>';

    var image = document.createElement("img");
    var canvas = document.createElement("canvas");
    const container = document.getElementById('container');
    container.append(image);
    container.append(canvas);
    functions.clean(canvas,image)
    expect(container.innerHTML).toEqual(
        '<video id="video" style="display: none;"></video>'
    )
})

test('if clean() hides imgUpload, video, video-controls', () => {
    // Set up our document body
    document.body.innerHTML =
        '<div id="content">'+
            '<input type="file" id="imageUpload">'+
            '<div id="container">'+
                '<video id="video"></video>'+
            '</div>'+
            '<div class="video-controls">'+
            '</div>'+
        '</div>';

    const imageUpload = document.getElementById('imageUpload');
    const video = document.getElementById('video');
    const videoControls = document.getElementsByClassName("video-controls")[0]
    functions.clean()
    expect(video.style.display).toEqual('none')
    expect(imageUpload.style.display).toEqual('none')
    expect(videoControls.style.display).toEqual('none')
})