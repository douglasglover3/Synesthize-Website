// Constants representing interval length (in cents)

// Tuning frequency used by program (in Hertz)
const A4_FREQ = 440;

export class EDOSystem {
    // Store each interval length in cents
    static Intervals = Object.freeze({
        Octave: 1200,
        PerfectFifth: 702,
        PerfectFourth: 498,
        MajorThird: 386,
        MinorThird: 316
    });

    // Store which intervals are being tracked
    static numIntervals: number = Object.keys(EDOSystem.Intervals).length;
    static trackedIntervals: boolean[] = Array(EDOSystem.numIntervals).fill(true);

    // Store basics of EDO system
    private tonality: number;
    private toneList;
    private semitone: number;       // Value is in cents

    // Store how many steps (semitones) each interval takes
    private octave: number;
    private perfectFifth: number;
    private perfectFourth: number;
    private majorThird: number;
    private minorThird: number;

    // Store EDO's circle-of-fifths for major/minor scales (for use in future versions)
    private circleOf5thsMaj: number[];
    private circleOf5thsMin: number[];

    // Builds an EDO system with <tones> number of tones
    constructor (tones: number) {
        // Get reference to <Intervals> object for knowing interval lengths
        let intervals = EDOSystem.Intervals;

        this.tonality = tones;
        this.toneList = EDOSystem.getNoteArrayByTonality(tones);
        this.semitone = intervals.Octave / tones;

        this.octave = tones;    // Octave already defined by <tones>
        this.perfectFifth = Math.round(intervals.PerfectFifth / this.semitone);
        this.perfectFourth = Math.round(intervals.PerfectFourth / this.semitone);
        this.majorThird = Math.round(intervals.MajorThird / this.semitone);
        this.minorThird = Math.round(intervals.MinorThird / this.semitone);

        this.circleOf5thsMaj = this.calcCircleOf5thsMaj();
        this.circleOf5thsMin = this.calcCircleOf5thsMin();
    }

    // Returns <num> mod <mod> in the range of [0, mod) (only positive values)
    private mapNoteInTonelist(num: number): number {
        let res = num % this.tonality;
        res = (res + this.tonality) % this.tonality;

        return res;
    }

    public getToneList(): any {
        return this.toneList;
    }

    // For later implementation of microtonality, need to come up with similar naming convention starting at C and including A
	// i.e. 19-tEDO = {C:0, C#:1, Cx: 2, D:3, ..., A:14, A#:15, Ax:16, B:17, B#: 18}
	public static getNoteArrayByTonality(tonality: number): any {
		switch(tonality) {
			case 12:
				return {C: 0, Db: 1, D: 2, Eb: 3, E: 4, F: 5, Gb: 6, G: 7, Ab: 8, A: 9, Bb: 10, B: 11};
		}

        return {error: 'Tonality not supported'};
	}

    // Start at C and stack <perfectFifth>'s until looping back to C
    private calcCircleOf5thsMaj(): number[] {
        let circleOf5thsMaj = [this.toneList.C];

        for (let i = 1; i < this.tonality; i++) {
            let prevNote = circleOf5thsMaj[i-1];
            let nextNote = this.mapNoteInTonelist(prevNote + this.perfectFifth);
            circleOf5thsMaj.push(nextNote);
        }

        return circleOf5thsMaj;
    }

    // Subtract <minorThird> from <circleOf5thsMaj>
    private calcCircleOf5thsMin(): number[] {
        let circleOf5thsMin = [];

        for (let i = 0; i < this.tonality; i++) {
            let noteInMaj = this.circleOf5thsMaj[i];
            let relativeMinor = this.mapNoteInTonelist(noteInMaj - this.minorThird);
            circleOf5thsMin.push(relativeMinor);
        }

        return circleOf5thsMin;
    }

    // Takes frequency (in Hertz) and outputs the corresponding note/octave pair
    public frequencyToNote(freq: number): {note: number, octave: number} {
        let notesAwayFromA4 = Math.round((this.tonality * Math.log2(freq / A4_FREQ)));
        let notePosition = this.mapNoteInTonelist(this.toneList.A + notesAwayFromA4);
        let octave = Math.floor((this.toneList.A + notesAwayFromA4) / this.tonality) + 4;

        return {note: notePosition, octave: octave};
    }

    // Track/Untrack the interval at <index> in <trackedIntervals>
    public static changeTrackedInterval(index: number): void {
        EDOSystem.trackedIntervals[index] = !EDOSystem.trackedIntervals[index];
    }

    // Return a hue based on the passed-in interval
    public getIntervalColor(prevNote: number, newNote: number): string {
        // Base-case (<prevNote> does not exist)
        if (prevNote === -1) return "#000000";

        let interval: number = (newNote - prevNote + this.tonality) % this.tonality;
        let tracked: boolean[] = EDOSystem.trackedIntervals;
        let keys: string[] = Object.keys(EDOSystem.Intervals);

        // Octave detected
        if (interval === this.octave && tracked[keys.indexOf('Octave')])
            return "#000000";

        // Perfect-fifth detected
        if (interval === this.perfectFifth && tracked[keys.indexOf('PerfectFifth')])
            return "#ff5100";

        // Perfect-fourth detected
        if (interval === this.perfectFourth && tracked[keys.indexOf('PerfectFourth')])
            return "#ffd000";

        // Major-third detected
        if (interval === this.majorThird && tracked[keys.indexOf('MajorThird')])
            return "#00ffb7";

        // Minor-third detected
        if (interval === this.minorThird && tracked[keys.indexOf('MinorThird')])
            return "#8400ff";

        return "#000000";
    }
}