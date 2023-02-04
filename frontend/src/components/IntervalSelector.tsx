import { useState } from 'react';
import { EDOSystem } from '../Classes/EDOSystem';

export default function IntervalSelector() {
    // Represents which intervals are being tracked
	let [selectedIntervals, setSelectedIntervals] = useState(Array(EDOSystem.numIntervals).fill(true));

    // Flip element at index of <selectedIntervals>
    const handleSelect = (e): void => {
        const selectedInd: number = e.target.value;
        const newIntervals: boolean[] = selectedIntervals.map((curr, i) => {
            if (i === selectedInd)
                return !curr;
            else
                return curr;
        });

        EDOSystem.changeTrackedInterval(selectedInd);
        setSelectedIntervals(newIntervals);
    };

    let ind: number = 0;
    let intervals = EDOSystem.Intervals;
    let intervalNames: string[] = Object.keys(intervals);

    return(
        <div className='interval-grid'>
            {intervalNames.map((name) => <div className='interval' key={name}>
                <input value={ind} type='checkbox' onChange={handleSelect} checked={selectedIntervals[ind++]} />
                <span>{name}</span>
                </div>)}
        </div>
    );
}