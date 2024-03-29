import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setVol } from '../Classes/AudioFunctions';
import ColorSelector from '../components/ColorSelector';
import Navbar from '../components/navbar';
import defaultSchemes from '../schemes/defaultSchemes'; 
import * as API from "../functions/API";

import '../css/AddEditScheme.css';

export default function AddSchema({setCookie, cookies}) {
  const navigate = useNavigate();

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

  const handleSubmit = async () => {
    // Get schemes from database or cookies depending on if user is logged in
    let schemes;
    if (localStorage.getItem('synesthizeUserData')) {
      // Handle scheme-name checking when hitting API endpoint
      schemes = [];
    } 
    else {
      if(cookies.schemeList === undefined) {
        setCookie('schemeList', [], { path: '/'});
      }
      schemes = cookies.schemeList;
    }

    // Error-handling to prevent special characters
    if (!name.match(/^[0-9a-zA-Z]+$/)) {
      setError('Please only use alphanumeric characters (a-Z and 0-9)');
      return;
    }

    // Error-handling to prevent duplicate names
    const allSchemes = defaultSchemes.concat(schemes);
    if (allSchemes.some((scheme) => (scheme.name === name))) {
      setError('Sorry! A color-scheme with that name already exists');
      return;
    }

    setError('');

    // Add hex code colors to notes array
    const notes: string[] = [C, Db, D, Eb, E, F, Gb, G, Ab, A, Bb, B];

    // Create new scheme object
    const newScheme = {name, notes};
    let schemeObj = {name: name, notes: notes};

    // Save to database or cookies depending on if user is logged in
    if (localStorage.getItem('synesthizeUserData')) {
      const userId = JSON.parse(localStorage.getItem('synesthizeUserData')).userId;

      try {
        await API.addScheme({userId, name, notes});
        navigate('/', {state:{scheme: schemeObj}});
      }
      catch(apiError) {
        setError(apiError.message);
      }
    } else {
      schemes.push(newScheme);
      setCookie('schemeList', schemes, {path: '/'});
      navigate('/', {state:{scheme: schemeObj}});
    }
  }

  return (
    <div className='background'>
      <Navbar/>
      <span className='title'>Add Scheme</span>
      <span className='subtitle'>Create your color profile</span>
      <br />
      <br />

      <label className='input-label'>Scheme Name</label>
      <input type='text' className='input-field'
        required autoFocus
        value={name} onChange={(e) => setName(e.target.value.trim())} />
      <span>{error}</span>
      <br />

      <label className='input-label'>Volume Slider</label>
      <div className='input-field'>
        <input type='range' id='volume-slider' value={volume} onChange={handleVolume} />
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
      <button type='button' className='button' onClick={() => {window.location.href='/'}}>Cancel</button>
    </div>
  );
}
