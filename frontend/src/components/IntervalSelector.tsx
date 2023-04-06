// Library and Component imports
import { useState } from 'react';

type Interval = {
    name: string,
    intervalLength: number,
    color: string,
    percentage: number
}

// Displays the list of trackable intervals for Level 1 Note Relationships
export default function IntervalSelector({ setCookie, cookies }) {
    // Get list of intervals from 'intervals.json'
    const [intervals, setIntervals]: [Interval[], any] = useState(cookies.intervals ?? []);
    const [addButtonClicked, setAddButtonClicked]: [boolean, any] = useState(false);
    const [newIntervalName, setNewIntervalName]: [string, any] = useState("");
    const [newIntervalLength, setNewIntervalLength]: [number, any] = useState(null);
    const [errorMessage, setErrorMessage]: [string, any] = useState("");

    // Remove this interval from the list entirely
    const handleDelete = (intervalName: string): void => {
        let newIntervals: Interval[] = intervals.filter(interval => interval.name !== intervalName);

        // Remove interval from <intervals>
        setIntervals(newIntervals);

        // Overwrite "intervals" cookie with new intervals
        setCookie("intervals", newIntervals, {path: '/'});
    }

    // Add a new interval to <intervals>
    const handleAdd = (): void => {
        let search: Interval[] = intervals.filter(interval =>
            (interval.name === newIntervalName || interval.intervalLength === newIntervalLength));

        if (newIntervalName.length === 0)
            setErrorMessage("Needs Interval Name");
        else if (newIntervalLength === null)
            setErrorMessage("Needs Interval Length");
        else if (newIntervalLength <= 0 || newIntervalLength > 12)
            setErrorMessage("Invalid Interval Length");
        else if (search.length !== 0)
            setErrorMessage("Interval Name/Length is taken");
        else {
            intervals.push({
                name: newIntervalName,
                intervalLength: newIntervalLength,
                color: "#FF0000",
                percentage: 0
            });
            resetUI();
            
            // Overwrite "intervals" cookie with new intervals
            setCookie("intervals", intervals, {path: '/'});
        }
    }
    const resetUI = (): void => {
        setAddButtonClicked(false);
        setErrorMessage("");
        setNewIntervalName("")
        setNewIntervalLength(null);
    }
    
    // Change percentage of interval
    const handlePercentage = (e): void => {
        const newPercentage: number = e.target.value;
        const intervalName: string = e.target.id;
        let newIntervals: Interval[] = intervals.map((interval) => {
            // This is the interval we want to modify
            if (interval.name === intervalName) {
                return {...interval, percentage: newPercentage};
            }
            else {
                return interval;
            }
        });
        setIntervals(newIntervals);

        // Overwrite 'intervals.json' file with new intervals
        setCookie("intervals", newIntervals, {path: '/'});
    };

    // Change color of interval
    const handleColor = (e): void => {
        const newColor: string = e.target.value;
        const intervalName: string = e.target.id;
        let newIntervals: Interval[] = intervals.map((interval) => {
            // This is the interval we want to modify
            if (interval.name === intervalName) {
                return {...interval, color: newColor};
            }
            else {
                return interval;
            }
        });
        setIntervals(newIntervals);

        // Overwrite 'intervals.json' file with new intervals
        setCookie("intervals", newIntervals, {path: '/'});
    };

    return(
        <ul className='interval-grid'>
            {!addButtonClicked ? 
                <div>
                    {intervals.map((interval) => 
                        <div className='interval' key={interval.name}>
                            <div className='interval-container'>
                                <span className='delete-interval' onClick={() => handleDelete(interval.name)}>&times;</span>
                                <input type="color" id={interval.name} className='interval-color'
                                    value={interval.color} onChange={handleColor} />
                                <span>{interval.name}</span>
                            </div>
                            <div className='percentage-slider-container'>
                                <input className='percentage-slider' type="range" id={interval.name}
                                    value={interval.percentage} onChange={handlePercentage} />
                            </div>
                        </div>
                    )}
                    <button type="button" className='button' onClick={() => setAddButtonClicked(true)}>
                        Add interval
                    </button>
                </div>
            :
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <input style={{width: "80%", marginBottom: "2%"}} placeholder="Interval Name" type="text" className='input-field'
                    required autoFocus
                    onChange = {(e) => setNewIntervalName(e.target.value.trim())} />
                <input style={{width: "80%", marginBottom: "2%"}} placeholder="Interval Length" type="number" className='input-field'
                    required
                    onChange = {(e) => setNewIntervalLength(parseInt(e.target.value))} />
                <div style={{display: "flex", flexDirection: "row", justifyContent: "center", width: "80%"}}>
                    <button type="button" className='button' onClick={() => resetUI()}>
                        Back
                    </button>
                    <button type="button" className='button' onClick={() => handleAdd()}>
                        Confirm
                    </button>
                </div>
                <p style={{color: "red", margin: "0px"}}>{errorMessage}</p>
            </div>
            }
        </ul>
    );
}