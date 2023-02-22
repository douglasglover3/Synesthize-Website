// Library and Component imports
import { EDOSystem } from '../Classes/EDOSystem';

// Shows the colors of the major tones for the selected scheme
export default function SchemePreview({ scheme }) {
    let toneList = EDOSystem.getNoteArrayByTonality(12);

    return(
        <div className='subsection'>
            <div className='color-block' style={{backgroundColor:scheme.notes[toneList.C]}} />
            <div className='color-block' style={{backgroundColor:scheme.notes[toneList.D]}} />
            <div className='color-block' style={{backgroundColor:scheme.notes[toneList.E]}} />
            <div className='color-block' style={{backgroundColor:scheme.notes[toneList.F]}} />
            <div className='color-block' style={{backgroundColor:scheme.notes[toneList.G]}} />
            <div className='color-block' style={{backgroundColor:scheme.notes[toneList.A]}} />
            <div className='color-block' style={{backgroundColor:scheme.notes[toneList.B]}} />
        </div>
    );
}