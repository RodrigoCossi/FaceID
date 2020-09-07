
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
const mockGetMedia = jest.fn((x) =>{
  return new Promise((resolve,reject)=>{
    x=new MockStream
    resolve(x)
  })
});


async function startVideo() {
  mockGetMedia()
    .then((stream) => {
      video.srcObject = stream;
      return new Promise((resolve,reject)=>{
          resolve(video.srcObject)
      })
    })
    .catch(error => {
      console.log("Something went wrong with the video stream");
    });
}

async function stopVideo(video,canvas) {
    var stream = video.srcObject;
    if (stream) {
      var tracks = stream.getTracks();
      tracks.forEach(track => {
          track.stop();
      });
      video.srcObject = null;
      canvas.remove();
    }
}

module.exports = {stopVideo, startVideo};
