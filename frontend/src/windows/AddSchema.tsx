import { useState } from 'react';
import { setVol } from '../Classes/AudioFunctions';
import ColorSelector from '../components/ColorSelector';

import '../css/AddEditScheme.css';

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

  const handleSubmit = () => {
    // TODO: Store list of current schemes via cookies/database
    let schemes = [];

    // Error-handling to prevent special characters
    if (!name.match(/^[0-9a-zA-Z]+$/)) {
      setError('Please only use alphanumeric characters (a-Z and 0-9)');
      return;
    }

    // Error-handling to prevent duplicate names
    for (let i = 0; i < schemes.length; i++) {
      if (schemes[i].name === name) {
        setError('Sorry! A color-scheme with that name already exists');
        return;
      }
    }

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
    window.location.href = '/';
  }

  return (
    <div className='background'>
      <span className='title'>Add Scheme</span>
      <span className='subtitle'>Create your color profile</span> <br /> <br />

    <label className='input-label'>Scheme Name</label>
    <input type="text" className='input-field'
      required autoFocus
      value = {name} onChange = {(e) => setName(e.target.value.trim())} />
    <span>{error}</span> <br />

    <label className='input-label'>Volume Slider</label>
    <div className='input-field'>
      <input type="range" id='volume-slider'
        value={volume} onChange={handleVolume} />
    </div>

      <div className='note-grid'>
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
      </div>

      <button type='button' className='button' onClick={handleSubmit}>Add Scheme</button>
      <button type="button" className='button' onClick={() => {window.location.href='/'}}>Cancel</button>
    </div>
  );
}
