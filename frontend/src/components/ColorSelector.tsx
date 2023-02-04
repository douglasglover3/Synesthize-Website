import { useState, useEffect } from 'react';
import { playNote } from '../Classes/AudioFunctions';

import PlayButton from '../images/PlayButton.png';
import '../css/AddEditScheme.css';

export default function ColorSelector(props) {
    const [note, setNote] = useState(props.noteColor);
    useEffect(() => {
        props.setNote(note);
    }, [note]);

    return(
        <div className='note'>
            <img src={PlayButton} alt='' className='play-note' onClick={() => playNote(props.noteName)} />
            <label className='note-name'>{props.noteName}</label>
            <input type="color" id={props.noteName} className='note-color'
                value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
    );
}