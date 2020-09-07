const faceapi = {
    fetchImage: jest.fn().mockResolvedValue('img'),
    detectSingleFace: jest.fn().mockResolvedValue({descriptor:'x'}),
    LabeledFaceDescriptors: jest.fn().mockResolvedValue('descriptors')
};
const loadingComplete = jest.fn()

// other ways of mocking the api functions:
// const faceapi = require('../js/face-api')
// jest.mock('../js/face-api.js');
// const faceapi =  jest.createMockFromModule('../js/face-api.js');
// faceapi.fetchImage.mockResolvedValue('img')
// faceapi.detectSingleFace.mockResolvedValue({descriptor:'x'})
// faceapi.LabeledFaceDescriptors.mockResolvedValue('descriptors')

async function loadLabeledImages() {
    const labels = ['Chandler', 'Joey', 'Monica', 'Phoebe','Rachel', 'Ross']
    return Promise.all(
      labels.map(async label => {
        const descriptions = [];
        for (let i = 1; i <= 4; i++) { // nº of pictures per label
          let img = await faceapi.fetchImage(`labeled_images/${label}/${i}.jpg`)
          const detections = await faceapi.detectSingleFace(img);
          if (!detections) {
              throw new Error(`no faces detected for ${label}/${i}`);
            }
            descriptions.push(detections.descriptor);
        }
        loadingComplete();
        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      })
    )
}


module.exports = {loadLabeledImages};