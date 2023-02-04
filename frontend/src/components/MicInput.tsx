import { useState, useRef , useEffect} from 'react';
export default function MicInput(props){
    const audioCtx = useRef(null);
    const interval = useRef(null);
    const gainNode = useRef(null);
    const [chosenId, changeId] = useState("default");
    const [recording, setRecording] = useState(false);
    const [volume, setVolume] = useState(0.5)
    const devicesList = useRef([]);
    useEffect(() => {
        devicesList.current = []
		//get microphone devices
        navigator.mediaDevices.enumerateDevices()
            .then((devices) => {
            devices.forEach((device) => {
                if(device.kind === "audioinput")
                {
                    let present = false;
                    devicesList.current.forEach((listedDevice) => {
                        if(device.groupId === listedDevice.groupId)
                            present = true;
                    })
                    if(!present)
                        devicesList.current.push(device);
                }
            });
            })
        
	}, [chosenId]);
    
    

    function startMicInput()
    {
        audioCtx.current = new window.AudioContext();
        gainNode.current = audioCtx.current.createGain();
        gainNode.current.gain.setValueAtTime(volume, audioCtx.current.currentTime);
        let microphoneStream = null;
        let analyserNode = audioCtx.current.createAnalyser()
        analyserNode.fftSize = 8192
        analyserNode.sampleRate = 96000
        let audioData = new Float32Array(analyserNode.fftSize);
        navigator.mediaDevices.getUserMedia ({audio: { deviceId: chosenId}})
            .then((stream) =>
            {
                microphoneStream = audioCtx.current.createMediaStreamSource(stream);
                microphoneStream.connect(gainNode.current);
                gainNode.current.connect(analyserNode);

                audioData = new Float32Array(analyserNode.fftSize);

                interval.current = setInterval(() => {      
                    analyserNode.getFloatTimeDomainData(audioData);
                    props.transformData(audioData)
                });

            });
        setRecording(true);
    }

    function stopMicInput()
    {
        audioCtx.current.close();
        clearInterval(interval.current);
        setRecording(false);
    }

    function changeVolume(inputVolume)
    {
        let newVolume = parseFloat(inputVolume.target.value) / 100;
        if(audioCtx.current != null && audioCtx.current.state === "running")
            gainNode.current.gain.setValueAtTime(newVolume, audioCtx.current.currentTime);
        setVolume(newVolume)
    }

    

    function setDevice (e) {
        let id = (e.target as HTMLSelectElement).value;
        changeId(id);
        if(audioCtx.current.state === "running")
        {
            stopMicInput();
            startMicInput();
        }
    }
    let index = 0;
    return(
        <div>
            <div className='subsection-3'>
                <select className='select-box' onChange={ setDevice }>
				{devicesList.current.map((device) => <option key = {index++} value = {device.Id}> { device.label } </option>)}
			    </select>
                {!recording ?
                <button type="button" className='button' onClick={() => startMicInput()}>
                    Start
                </button>
                :
                <button type="button" className='button' onClick={() => stopMicInput()}>
                    Stop
                </button>
                }
            </div>
            <div className='input-field-volume-main'>
                <input type="range" id='volume-main'
                    value={Math.round(volume * 100)} onChange={changeVolume} />
            </div>
        </div>
    )
}
