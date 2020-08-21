window.addEventListener("load", () => {
    clean()
  });
  
  const imageUpload = document.getElementById('imageUpload');
  const video = document.getElementById('video');
  const container = document.getElementById('container');
  let canvas;
  let image;
  
  // Load models
  Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models'), // detect faces (acurate but slow. used for pictures)
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'), // detect 68 points face landmarks
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'), // recognize person (compares euclidean distance from reference data)
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'), // detect faces (less acurate but fast. used for video)
    faceapi.nets.faceExpressionNet.loadFromUri('/models'), // add face expression descriptor
    faceapi.nets.ageGenderNet.loadFromUri('/models') // add age & gender descriptor
  ]).then(start);
  
  async function start() {
    const labeledFaceDescriptors = await loadLabeledImages();
    const maxDescriptorDistance = 0.6; // euclidian distance threshold. (0.6 is a good reference value)
    // it is the max distance threshold of two descriptors. The higher the distance the more unsimilar two faces are. 
    // If two descriptors have a lower distance than the threshold value we have a "match" and if none of the descriptors match,
    // the face will be unknown.
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance);
    imageUpload.addEventListener('change', async () => {
      if (image) image.remove();
      if (canvas) canvas.remove();
      image = await faceapi.bufferToImage(imageUpload.files[0]);
      container.append(image);
      canvas = faceapi.createCanvasFromMedia(image);
      container.append(canvas);
      const displaySize = { width: image.width, height: image.height };
      faceapi.matchDimensions(canvas, displaySize);
      const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));
      results.forEach((result, i) => {
        const box = resizedDetections[i].detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() });
        drawBox.draw(canvas);
      })
    })
  }
  
  function loadLabeledImages() {
    var div = document.createElement("div");
    div.className += 'loader-wrapper';
    div.innerHTML += '<div class="loader"></div><br>';
    // div.innerHTML +='<p>Loading Dataset and Creating Face Vector Models...</p>';
    // div.innerHTML +='<p>Loading Models, Fetching Images and Detecting Single Faces...</p>';
    div.innerHTML +='<p>Loading Dataset and Training Models...</p>';
    document.body.appendChild(div);
    const labels = ['Chandler', 'Joey', 'Monica', 'Phoebe','Rachel', 'Ross']
    return Promise.all(
      labels.map(async label => {
        const descriptions = [];
        for (let i = 1; i <= 4; i++) {
          const img = await faceapi.fetchImage(`labeled_images/${label}/${i}.jpg`);
          const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
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
  
  function loadingComplete() {
    $(".loader-wrapper").fadeOut("slow");
    $(".loader-wrapper").remove();
  }
  
  
  function stopVideo() {
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
  
  function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
    })
    .catch(function (error) {
      console.log("Something went wrong with the video stream");
    });
  }
  
  
  video.addEventListener('play', () => {
    if(canvas) canvas.remove(); // create canvas()
      canvas = faceapi.createCanvasFromMedia(video);
      container.append(video);
      container.append(canvas);
      const displaySize = { width: video.width, height: video.height };
      faceapi.matchDimensions(canvas, displaySize);
  
      // function startDetection(){
      //   faceDetection = setInterval(async () => {
      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks().withFaceExpressions().withAgeAndGender();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        if($("#expression-switch").is(":checked")){
          faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        }
        if($("#age-gender-switch").is(":checked")){
          resizedDetections.forEach(result => {
            const { age, gender, genderProbability } = result
            new faceapi.draw.DrawTextField(
              [
                `${faceapi.round(age, 0)} years`,
                `${gender} (${faceapi.round(genderProbability)})`
              ],
              result.detection.box.bottomRight
            ).draw(canvas)
          })
        }
      }, 100);
    })
  
    function clean() {
      imageUpload.value='';
      $("#imageUpload").hide();
      $("#video").hide();
      $(".video-controls").hide();
      if (canvas) canvas.remove();
      if (image) image.remove();
      stopVideo();
    }