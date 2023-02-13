import { useState } from 'react';
import SchemeDropdown from "../components/SchemeDropdown";
import IntervalSelector from '../components/IntervalSelector';
import {Fourier} from "../Classes/FourierTransform"
import MicInput from "../components/MicInput";
import {EDOSystem} from "../Classes/EDOSystem";
import {DisplayManager} from "../Classes/DisplayManager"
import { ColorCanvas } from '../Classes/ColorDisplay';
import Navbar from '../components/navbar';

import '../css/MainWindow.css';

export default function MainWindow({setCookie, cookies}) {
	let wave_display_flag = 0

	let TONES: number = 12;
	let fourier = new Fourier();
    let edo = new EDOSystem(TONES);
	let display_manager = new DisplayManager(TONES);

	let canvas = document.createElement("canvas")
	canvas.width = 370
	canvas.height = 50
	const ele = document.getElementById('wave_display')
    if (ele != null) {
		while (ele.firstChild) {
			ele.removeChild(ele.firstChild);
		}
      ele.append(canvas)
    }

	// Represents the currently selected color-scheme
	let [scheme, setSchemeInMain] = useState({ name: "", notes: [""] });
	display_manager.change_scheme(scheme)

	let time = 0
	let cnt = 0


	function OnDraw()
    {
        time = time + 0.05;
        var dataLine = canvas.getContext("2d");

        dataLine.clearRect(0, 0, canvas.width, canvas.height);

        dataLine.beginPath();

        for(cnt = -1; cnt <= canvas.width; cnt++)
        {
            dataLine.lineTo(cnt, canvas.height * 0.5 - (Math.random() * 2 + Math.cos(time + cnt * 0.05) * ((canvas.height / 2)-10) *  Math.cos(time + cnt) * Math.cos(cnt)));
        }

        dataLine.lineWidth = 1;
        dataLine.strokeStyle = "black";
        dataLine.stroke();
    }

	function start_wave_display() {
		setInterval(OnDraw, 10);
		wave_display_flag = 1
	}

	function readMicData(data) {
		if(wave_display_flag === 0) {
			start_wave_display()
		}
		//makes data into two arrays, x and y
		let inputData = fourier.normalizeData(data);
		//transforms data into frequency domain using fourier transform
		let outputData = fourier.applyTransform(inputData);
		//attempts to get top five frequencies from transformed data
		let frequencies = fourier.getFrequencies(outputData, 5)
		let estimate = edo.frequencyToNote(frequencies[0])
		//console.log(`Estimated note: Note=${estimate.note} Octave=${estimate.octave}`);
		display_manager.display(estimate.note, estimate.octave)
	}

	return (
		<div>
			<Navbar />
			<div id='background' className='background'>
				<span className='title'>Synesthize</span>
				<span className='subtitle'>A Sound to Color Application</span> <br />

				<div className='subsection-2'>
					<div className='color-options'>
						<label className='subtitle'>Color Schemes</label> <br /> <br />
						<SchemeDropdown setSchemeInMain={setSchemeInMain} setCookie={setCookie} cookies={cookies}/>
					</div>
					<div className='interval-options'>
						<label className='subtitle'>Tracked Intervals</label> <br /> <br />
						<IntervalSelector />
					</div>
					<div className='mic-options'>
						<label className='subtitle'>Microphone Controls</label> <br /> <br />
						<MicInput transformData={readMicData} />
					</div>
				</div>
			</div>

			<ColorCanvas />
		</div>
	);
}
