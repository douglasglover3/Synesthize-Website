import { useState, useEffect } from 'react';
import { playNote } from '../Classes/AudioFunctions';

export default function ColorSelector(props) {
    const [note, setNote] = useState(props.noteColor);
    useEffect(() => {
        props.setNote(note);
    }, [note]);

    return(
        <div>
            <label>{props.noteName}</label>
            <input type="color" id={props.noteName} 
                value={note} onChange={(e) => setNote(e.target.value)} />
            <button type="button" onClick={() => playNote(props.noteName)}>Try Me!</button>
        </div>
    );
}