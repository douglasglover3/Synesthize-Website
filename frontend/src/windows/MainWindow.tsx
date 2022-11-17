import { useState } from 'react';
import {Fourier} from "../Classes/FourierTransform"
import MicInput from "../components/MicInput";
import {EDOSystem} from "../Classes/EDOSystem";
import {DisplayManager} from "../Classes/DisplayManager"

type Scheme = {
	name: string,
	notes: string[]
}

let display_manager = new DisplayManager(12);

function readMicData(data) {
    let fourier = new Fourier;
    let edo = new EDOSystem(12);

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

export default function MainWindow() {
	let [scheme, setSchemeInMain] = useState({ name: "", notes: [""] });
	display_manager.change_scheme(scheme)

	return (
		<div>
			<p>Main Window</p>

			<br />
			<div className='mic_input'>
				<h3>Mic Recording</h3>
				<MicInput transformData={readMicData}/>
			</div>
		</div>
	);
}
