const ssdMobilenetv1 = new Promise((resolve,reject)=>{
    resolve('net one loaded')
})

const faceLandmark68Net = new Promise((resolve,reject)=>{
    resolve('net two loaded')
})

const faceRecognitionNet = new Promise((resolve,reject)=>{
    resolve('net three loaded')
})

const tinyFaceDetector = new Promise((resolve,reject)=>{
    resolve('net four loaded')
})

const faceExpressionNet = new Promise((resolve,reject)=>{
    resolve('net five loaded')
})

const ageGenderNet = new Promise((resolve,reject)=>{
    resolve('net six loaded')
})


function loadNets() { 
    return Promise.all([
        ssdMobilenetv1,
        faceLandmark68Net,
        faceRecognitionNet,
        tinyFaceDetector,
        faceExpressionNet,
        ageGenderNet
    ])
}

module.exports = loadNets