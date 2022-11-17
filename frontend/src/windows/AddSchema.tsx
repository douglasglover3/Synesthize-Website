import { useState } from 'react';
//import { SchemeFunctions } from '../Classes/SchemeFunctions';
import { setVol } from '../Classes/AudioFunctions';
import ColorSelector from '../components/ColorSelector';

//Not for website
//const fs = window.require('fs');
//const path = window.require('path');

export default function AddSchema() {
  const [volume, setVolume] = useState(50);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [C, setC] = useState('#000000');
  const [Db, setDb] = useState('#000000');
  const [D, setD] = useState('#000000');
  const [Eb, setEb] = useState('#000000');
  const [E, setE] = useState('#000000');
  const [F, setF] = useState('#000000');
  const [Gb, setGb] = useState('#000000');
  const [G, setG] = useState('#000000');
  const [Ab, setAb] = useState('#000000');
  const [A, setA] = useState('#000000');
  const [Bb, setBb] = useState('#000000');
  const [B, setB] = useState('#000000');

  const handleVolume = (e) => {
    let volumeVal = parseInt(e.target.value);
    setVolume(volumeVal);   // In AddSchema.tsx
    setVol(volumeVal);      // In AudioFunctions.tsx
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    //let schemes = SchemeFunctions.getSchemes();

    // Error-handling to prevent special characters
    if (!name.match(/^[0-9a-zA-Z]+$/)) {
      setError('Please only use alphanumeric characters (a-Z and 0-9)');
      return;
    }

    // Error-handling to prevent duplicate names
    // for (let i = 0; i < schemes.length; i++) {
    //   if (schemes[i].name === name) {
    //     setError('Sorry! A color-scheme with that name already exists');
    //     return;
    //   }
    // }

    setError('');

    // Add hex code colors to <noteArray>
    let noteArray: string[] = [];
    noteArray.push(C);
    noteArray.push(Db);
    noteArray.push(D);
    noteArray.push(Eb);
    noteArray.push(E);
    noteArray.push(F);
    noteArray.push(Gb);
    noteArray.push(G);
    noteArray.push(Ab);
    noteArray.push(A);
    noteArray.push(Bb);
    noteArray.push(B);

    // Saves new scheme into file AND into schemes array
    let schemeObj = {name: name, notes: noteArray};
    //Not for website
    //let filePath = path.join('src', 'schemes', schemeObj.name + '.json');
    //fs.writeFileSync(filePath, JSON.stringify(schemeObj));
    //SchemeFunctions.addScheme(schemeObj);
    window.location.href = '/';
  }

  return (
    <div>
      <span>Add New Color Scheme</span> <br /> <br />

      <span>Volume Slider</span>
      <input type="range" id='volume-slider'
        value={volume} onChange={handleVolume} /> <br /> <br />

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name Your Scheme: </label>
          <input type="text" id="name"
            required autoFocus
            value = {name} onChange = {(e) => setName(e.target.value.trim())}/>
        </div>
        <span>{error}</span> <br /> <br />

        <ColorSelector noteName='C' noteColor={C} setNote={setC} />
        <ColorSelector noteName='Db' noteColor={Db} setNote={setDb} />
        <ColorSelector noteName='D' noteColor={D} setNote={setD} />
        <ColorSelector noteName='Eb' noteColor={Eb} setNote={setEb} />
        <ColorSelector noteName='E' noteColor={E} setNote={setE} />
        <ColorSelector noteName='F' noteColor={F} setNote={setF} />
        <ColorSelector noteName='Gb' noteColor={Gb} setNote={setGb} />
        <ColorSelector noteName='G' noteColor={G} setNote={setG} />
        <ColorSelector noteName='Ab' noteColor={Ab} setNote={setAb} />
        <ColorSelector noteName='A' noteColor={A} setNote={setA} />
        <ColorSelector noteName='Bb' noteColor={Bb} setNote={setBb} />
        <ColorSelector noteName='B' noteColor={B} setNote={setB} />

        <input type="submit" value="Submit" />
      </form>
      <button type="button" onClick={() => {window.location.href='/'}}>Cancel</button>
    </div>
  );
}
