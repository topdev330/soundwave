'use strict';

var wavesurfer;

// Init & load
document.addEventListener('DOMContentLoaded', function() {
    let options = {
        container: '#waveform',
        waveColor: '#ffeb3b',
        progressColor: 'white',
        loaderColor: 'white',
        cursorColor: 'navy',
    };

    if (location.search.match('scroll')) {
        options.minPxPerSec = 100;
        options.scrollParent = true;
    }

    if (location.search.match('normalize')) {
        options.normalize = true;
    }

    // Init wavesurfer
    wavesurfer = WaveSurfer.create(options);

    /* Progress bar */
    (function() {
        const progressDiv = document.querySelector('#progress-bar');
        const progressBar = progressDiv.querySelector('.progress-bar');

        let showProgress = function(percent) {
            progressDiv.style.display = 'block';
            progressBar.style.width = percent + '%';
        };

        let hideProgress = function() {
            progressDiv.style.display = 'none';
        };

        wavesurfer.on('loading', showProgress);
        wavesurfer.on('ready', hideProgress);
        wavesurfer.on('destroy', hideProgress);
        wavesurfer.on('error', hideProgress);
    })();

    wavesurfer.load('./assets/alarm.mp3');
    document.querySelector("#downloadPDF").onclick = function() { 
        console.log("download!!");
        // only jpeg is supported by jsPDF
        var canvas = document.querySelector('#waveform canvas');
        canvas.fillStyle = "red";
        var imgData = canvas.toDataURL("image/jpeg", 1.0);

        // var link = document.createElement('a');
        // link.download = 'filename.png';
        // link.href = imgData
        // link.click();


        var pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData)  
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
        pdf.addImage(imgData, 'PNG', 0, 50, pdfWidth, pdfHeight);

        pdf.setTextColor(0,0,0);
        pdf.text(20, 30, `My voice is my password  - ${new Date().toDateString()}`)
        pdf.save("audio.pdf"); 
    }
});
