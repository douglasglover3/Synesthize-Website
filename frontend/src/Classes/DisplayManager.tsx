import React from "react";
import { textChangeRangeIsUnchanged } from "typescript";
import { ColorCanvas } from "../Classes/ColorDisplay";
import { EDOSystem } from "../Classes/EDOSystem";

const display_threshold = 5

// TODO: Replace with extensible EDO system
let edo = new EDOSystem(12);

export class DisplayManager{
	canvas: ColorCanvas;
	counter: number;
	tonality: number;
	currNote: number;
	prevNote;
	currentScheme: string[]

	constructor(tonality:number) {
		this.canvas = new ColorCanvas('c1')
		this.counter = 0
		this.tonality = tonality
		this.currNote = -1;		// No note current playing
		this.prevNote = -1;		// No note played before it
		this.currentScheme = new Array()

		for (let i = 0; i < this.tonality; i++) {
			this.currentScheme[i] = '#000000'
		}

	}

	change_scheme(new_scheme) {
		for(let i = 0; i < this.tonality; i++) {
			this.currentScheme[i] = new_scheme.notes[i]
		}
	}

	display(note:number, octave:number) {
		if(this.currNote == -1 && !Number.isNaN(note)){ // set first seen note
			this.currNote = note;
			this.prevNote = note
		}
		else if(this.counter <= 0) {
			this.currNote = note
		}

		if(note == this.currNote) {
			this.counter += 1
		}
		else {
			this.counter -= 1
		}


		if(this.counter >= display_threshold) {
			this.counter = display_threshold
			if(this.canvas.check_inactive()) {
				let intervalColor = edo.getIntervalColor(this.currNote, this.prevNote)
				this.canvas.draw_new(this.currentScheme[note], octave, intervalColor)
			}
		}
		else if(this.counter <= 0) {
			this.counter = 0
			if(this.canvas.check_active()) {
				this.canvas.fade_out()
				if(!Number.isNaN(this.currNote)) {
					this.prevNote = this.currNote
				}
			}
		}
	}
}
