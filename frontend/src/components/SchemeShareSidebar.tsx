import {useState, useEffect} from 'react';
import * as API from "../functions/API";

import '../css/AddEditScheme.css';
import '../css/Sidebar.css';

type Scheme = {
	name: string,
	notes: string[]
}

export default function SchemeShareSidebar({ sidebarOpen, setSidebarOpenInParent, addToParentSchemeList }) {
    // Store list of received schemes
    const [receivedSchemes, setReceivedSchemes] = useState([]);
    useEffect(() => {
        if (localStorage.getItem('synesthizeUserData')) {
            const userId = JSON.parse(localStorage.getItem('synesthizeUserData')).userId;
            API.getInvalidSchemes({userId})
                .then((ret) => setReceivedSchemes(ret.invalidSchemes));
        }
    }, []);
    let ind = 0;

    // Close out lightbox and reset any data
    const closeSidebar = (): void => {
        setSidebarOpenInParent(false);
    }

    // Accepts a scheme (validates it and adds to main schemelist)
    const acceptScheme = async (e): Promise<void> => {
        if (!localStorage.getItem('synesthizeUserData')) return;

        // Get scheme based on name
        const scheme: Scheme = receivedSchemes.find(scheme => scheme.name === e.target.value);

        // Hit database
        const userId: string = JSON.parse(localStorage.getItem('synesthizeUserData')).userId;
        const name: string = scheme.name;
        await API.validateScheme({userId, name});
        
        // Remove scheme from this list and add to <SchemeDropdown />
        setReceivedSchemes(receivedSchemes.filter((scheme) => scheme.name !== name));
        addToParentSchemeList(scheme);
    }

    // Declines a scheme (deletes it from this user's schemelist)
    const declineScheme = async (e): Promise<void> => {
        if (!localStorage.getItem('synesthizeUserData')) return;

        // Get scheme based on name
        const scheme: Scheme = receivedSchemes.find(scheme => scheme.name === e.target.value);

        // Hit database
        const userId: string = JSON.parse(localStorage.getItem('synesthizeUserData')).userId;
        const name: string = scheme.name;
        await API.deleteScheme({userId, name});
        
        // Remove scheme from this list
        setReceivedSchemes(receivedSchemes.filter((scheme) => scheme.name !== name));
    }

    // Lightbox is only visible when selected
    return(
        <div className='sidebar' style={sidebarOpen ? {display: 'block'} : {display: 'none'}}>
            <label id='close-button' onClick={closeSidebar}>&times;</label>
            <div className='received-schemes'>
                <span id='accept-decline-schemes' className='subtitle'>Accept/Decline Schemes</span> <br /> <br />
                <div className='received-scheme-list'>
                    <ul>
                    {
                        receivedSchemes.map((scheme: Scheme) => 
                            <li key={scheme.name} value={ind++}>
                                {scheme.name}
                                <button value={scheme.name} onClick={acceptScheme}>Accept</button>
                                <button value={scheme.name} onClick={declineScheme}>Decline</button>
                            </li>
                        )
                    }
                    </ul>
                </div>
            </div>
        </div>
    );
}
