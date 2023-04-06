import React, { useState } from 'react';
import Navbar from '../components/navbar';

import '../css/AboutUs.css';

export const AboutUs = (props) => {
    const [ toggleState, setToggleState ] = useState(1);
    const toggleTab: any = (index) => {
        setToggleState(index)
    }
    return (
        <div>
            <Navbar/>
        <div className="aboutus-container" id="aboutus-background">
            <div className='bloc-tabs'>
                <button className={toggleTab === 1 ? "tabs active-tab": "tabs"} 
                onClick = {() => toggleTab(1)}>
                    Members
                </button>
                <button className={toggleTab === 2 ? "tabs active-tab": "tabs"}
                onClick = {() => toggleTab(2)}>
                    Introduction
                </button>
                <button className={toggleTab === 3 ? "tabs active-tab": "tabs"}
                onClick = {() => toggleTab(3)}>
                    Synesthize Origin
                </button>
            </div>

            <div className='content-tabs'>
                <div className={toggleState === 1 ? "content active-content" : "content"}>
                    <>
                        <br/>
                        Joshua Balila: Project Manager / App Frontend
                        <br/>
                        <br/>
                        Douglas Glover: App Backend / Site Backend
                        <br/>
                        <br/>
                        Thien Than: App Backend / Site Frontend
                        <br/>
                        <br/> 
                        Brantley Deines: App Frontend
                        <br/> 
                        <br/>
                        Juan Gutierrez: Research / Site Frontend
                    </>
                </div>
                <div className={toggleState === 2 ? "content active-content" : "content"}>
                    <p>
                    The project is about creating a React JavaScript app in electron regarding Chromesthesia which connects between music and color. So, what is Chromesthesia? 
                    The synesthesia is also called sound-to-color synesthesia, which is a type of synesthesia that involuntarily evokes an experience of color, shape, and movement. 
                    In short, people with Chromesthesia will be consciously aware of their synesthesia color perception during their daily life. Much of our choices in color and 
                    visual representations will be inspired by how these individuals experience sounds.
                    <br/>
                    <br/>
                    The app in this project will first take in the mic input using the already existing mic of the phone and then transfer that mic input into audio data using an 
                    analysis JavaScript library. The audio data then gets processed by the Fourier transform library and turns it into a frequency that can be used to map notes and 
                    colors together using a table that we will later create which will map notes to color according to frequency since fundamentally color and sounds both have a 
                    frequency. Then the color will be displayed on the screen according to each sound the mic takes in. 
                    </p>
                </div>
                <div className={toggleState === 3 ? "content active-content" : "content"}>
                    <p>
                        The original idea for this project came from Dr. Leinecker, the sponsor of Synesthize. It all started when Dr. Leinecker went to a musical performance 
                        where the different notes played by the flute player would produce different colors of light which gave him the idea of displaying color representing
                        notes that are being played. From this experience, the idea of Synesthize was born.
                        <br/>
                        <br/>
                        A little bit about the flute that gave Dr. Leinecker the idea for Synesthize:
                        <br/>
                        In the paper named "Fantasia" talking about the making behind the flutes written by Juan Novo, the flute instrument "has keys made of 24-karat gold-plated German 
                        nickel silver. It can be illuminated through a fiber optics arrangement allowing different colors to flick on when different notes are played. The flute is made 
                        from a hollowed-out, single length of clear acrylic, polished inside and out, then fitted with keys."  
                    </p>
                </div>
            </div>
        </div>
        </div>
    )
}