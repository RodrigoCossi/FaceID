const functions = require('./functions')


let video = document.createElement("video")
let canvas = document.createElement("canvas")


// mock MediaStream()
function MockTrack(i) {
    this.track = i;
    this.stop = ()=>{};
}
function MockStream() {
    this.tracks = [new MockTrack(1), new MockTrack(2)];
    this.getTracks = ()=>{
        return this.tracks;
    };
}


test('startVideo() should be defined', ()=>{
    expect(functions.startVideo).toBeDefined();
}) 

test('startVideo() should create video stream', async ()=>{
    let stream = await functions.startVideo()
    expect(stream).toBeTruthy
}) 

test('stopVideo() should be defined', ()=>{
    expect(functions.stopVideo).toBeDefined();
}) 

test('stopVideo() should eliminate video stream', ()=>{
    video.srcObject = new MockStream();
    expect(video.srcObject instanceof MockStream).toBeTruthy()
    functions.stopVideo(video,canvas)
    expect(video.srcObject).toBeFalsy()
}) 


