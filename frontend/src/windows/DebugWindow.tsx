import Plot from 'react-plotly.js';
import { useState } from 'react';
import {Fourier} from "../Classes/FourierTransform"
import MicInput from "../components/MicInput";
import {EDOSystem} from "../Classes/EDOSystem";

export default function DebugWindow() {
  const [inputX, setInputX] = useState([])
  const [inputY, setInputY] = useState([])

  const [outputX, setOutputX] = useState([])
  const [outputY, setOutputY] = useState([])

  let fourier = new Fourier();
  let edo = new EDOSystem(12);

  //Create random data
  function getData() {
    //create testing data
    let randomValue: number = Math.round(Math.random() * 500) + 600
    let frequency: number = Math.round(Math.random() * 300)
    let inputData = fourier.createSampleData(randomValue, frequency) 
    setInputX(inputData.x)
    setInputY(inputData.y)

    //input data into transform
    let outputData = fourier.applyTransform(inputData)
    setOutputX(outputData.x)
    setOutputY(outputData.y)

    let frequencies: number[] = fourier.getFrequencies(outputData, 5)
    let estimate = edo.frequencyToNote(frequencies[0])
    console.log("Size is " + randomValue)
    console.log("Frequency is " + frequency)
    console.log("Top 5 Measured Frequencies: " +  frequencies)
    console.log(`Estimated note: Note=${estimate.note} Octave=${estimate.octave}`);
  }

  function readMicData(data) {
    //makes data into two arrays, x and y
    let inputData = fourier.normalizeData(data);
    setInputX(inputData.x)
    setInputY(inputData.y)
    //transforms data into frequency domain using fourier transform
    let outputData = fourier.applyTransform(inputData);
    setOutputX(outputData.x)
    setOutputY(outputData.y)
    //attempts to get top five frequencies from transformed data
    let frequencies = fourier.getFrequencies(outputData, 5)
    let estimate = edo.frequencyToNote(frequencies[0])
    console.log("Top 5 Measured Frequencies: " +  frequencies)
    console.log(`Estimated note: Note=${Object.keys(edo.getToneList())[estimate.note]} Octave=${estimate.octave}`);
  }
  
  // const Mic = new MicInput(true);
  return (
    <div>
      <button onClick={(() => getData())}>Random Data</button>
      <div className='mic_input'>
        <h2>Mic Recording</h2>
        <MicInput transformData={readMicData}/>
      </div>
      <Plot
        data={[
          {
            x: inputX,
            y: inputY,
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'red'},
          }
        ]}
        layout={{width: 400, height: 300, autoSize: false, title: 'Input Data'}}
      />
      <Plot
        data={[
          {
            x: outputX,
            y: outputY,
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'red'},

          }
        ]}
        layout={{width: 400, height: 300, title: 'Fourier Transform Data'}}
      />
    </div>
  );
}

