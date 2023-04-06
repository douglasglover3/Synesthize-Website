import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setVol } from '../Classes/AudioFunctions';
import ColorSelector from '../components/ColorSelector';
import Navbar from '../components/navbar';
import defaultSchemes from '../schemes/defaultSchemes'; 
import * as API from "../functions/API";

import '../css/AddEditScheme.css';

export default function EditSchema({setCookie, cookies}) {
  const navigate = useNavigate();
  const location = useLocation();
  
  let selectedScheme = location.state.scheme;
  let originalName = selectedScheme.name;

  // Variables used in form
  const [volume, setVolume] = useState(50);
  const [name, setName] = useState(selectedScheme.name);
  const [error, setError] = useState('');
  const [C, setC] = useState(selectedScheme.notes[0]);
  const [Db, setDb] = useState(selectedScheme.notes[1]);
  const [D, setD] = useState(selectedScheme.notes[2]);
  const [Eb, setEb] = useState(selectedScheme.notes[3]);
  const [E, setE] = useState(selectedScheme.notes[4]);
  const [F, setF] = useState(selectedScheme.notes[5]);
  const [Gb, setGb] = useState(selectedScheme.notes[6]);
  const [G, setG] = useState(selectedScheme.notes[7]);
  const [Ab, setAb] = useState(selectedScheme.notes[8]);
  const [A, setA] = useState(selectedScheme.notes[9]);
  const [Bb, setBb] = useState(selectedScheme.notes[10]);
  const [B, setB] = useState(selectedScheme.notes[11]);

  const handleVolume = (e) => {
    let volumeVal = parseInt(e.target.value);
    setVolume(volumeVal);   // In AddSchema.tsx
    setVol(volumeVal);      // In AudioFunctions.tsx
  }

  const handleSubmit = async () => {
    // Get schemes from database or cookies depending on if user is logged in
    let schemes;
    if (localStorage.getItem('synesthizeUserData')) {
      schemes = [];
    } 
    else {
      if(cookies.schemeList === undefined)
        setCookie("schemeList", [], { path: "/"});
      schemes = cookies.schemeList;
    }

    // Error-handling to prevent special characters
    if (!name.match(/^[0-9a-zA-Z]+$/)) {
      setError('Please only use alphanumeric characters (a-Z and 0-9)');
      return;
    }

    // Error-handling to prevent duplicate names, but allow overwriting filename
    const allSchemes = defaultSchemes.concat(schemes);
    for (let i = 0; i < allSchemes.length; i++) {
      if (name === allSchemes[i].name && originalName !== allSchemes[i].name) {
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

    // Create new scheme object
    let schemeObj = {name: name, notes: noteArray};

    // Save to database or cookies depending on if user is logged in
    if (localStorage.getItem('synesthizeUserData')) {
      const userId = JSON.parse(localStorage.getItem('synesthizeUserData')).userId;
      const name = originalName;
      const newName = name;
      const notes = noteArray;

      try {
        await API.editScheme({userId, name, newName, notes});
        navigate('/', {state:{scheme: schemeObj}});
      }
      catch(apiError) {
        setError(apiError.message);
      }
    }
    else {
      for (let i = 0; i < schemes.length; i++) {
        if (originalName === schemes[i].name) {
          schemes[i] = schemeObj;
          break;
        }
      }
      setCookie("schemeList", schemes, { path: "/"});
      navigate('/', {state:{scheme: schemeObj}});
    }
  }

  return (
    <div className='background'>
      <Navbar/>
      <span className='title'>Edit Scheme</span>
      <span className='subtitle'>Change your color profile</span> <br /> <br />

      <label className='input-label'>Rename Your Scheme: </label>
      <input type="text" className='input-field'
          required autoFocus
          value = {name} onChange = {(e) => setName(e.target.value.trim())}/>
      <span>{error}</span> <br /> <br />

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

      <button type='button' className='button' onClick={handleSubmit}>Edit Scheme</button>
      <button type="button" className='button' onClick={() => {navigate('/', {state:{scheme: selectedScheme}});}}>Cancel</button>
    </div>
  );
}
