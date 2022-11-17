export default function MicInput(props){
    let audioCtx;
    let microphoneStream;
    let analyserNode;
    let audioData;

    function startMicInput()
    {
        audioCtx = new window.AudioContext();
        microphoneStream = null;
        analyserNode = audioCtx.createAnalyser()
        analyserNode.fftSize = 8192
        analyserNode.sampleRate = 96000
        audioData = new Float32Array(analyserNode.fftSize);;
        navigator.mediaDevices.getUserMedia ({audio: true})
            .then((stream) =>
            {
                microphoneStream = audioCtx.createMediaStreamSource(stream);
                microphoneStream.connect(analyserNode);

                audioData = new Float32Array(analyserNode.fftSize);

                setInterval(() => {
                    analyserNode.getFloatTimeDomainData(audioData);
                    props.transformData(audioData)
                });

            });
    }

    // function stopMicInput()
    // {
    //     MediaStreamTrack.stop();
    // }
        
        return(
            <div>
                <button type="button" onClick={() => startMicInput()}>
                    Start
                </button>
                {/* <button type="button" onClick={() => stopMicInput()}>
                    Stop
                </button> */}
            </div>
        )
    }
