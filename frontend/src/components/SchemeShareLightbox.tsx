import {useState, useEffect} from 'react';

import '../css/AddEditScheme.css';
import '../css/Lightbox.css';

export default function SchemeShareLightbox({lightboxVisible, setLightboxVisibleInParent, scheme}) {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');

    // Close out lightbox and reset any data
    const closeLightbox = (): void => {
        setUsername('');
        setMessage('');
        setLightboxVisibleInParent(!lightboxVisible);
    }

    const handleShare = (): void => {
        // Get info of this scheme
        const schemeName = scheme.name;
        const schemeNotes = scheme.notes;

        // Add this to <username>'s scheme-list if they don't have a scheme by this name
        // TODO: Do API call to add this to <username>'s scheme
        // TODO: Check if API call returns an error and set <message> accordingly

        setMessage('Scheme successfully shared');
    }

    // Lightbox is only visible when selected
    return(
        <div className='lightbox' style={lightboxVisible ? {display: 'block'} : {display: 'none'}}>
            <label id='close-button' onClick={closeLightbox}>&times;</label>
            <div className='lightbox-input'>
                <div className='share-scheme'>
                    <span className='subtitle'>Share a Scheme</span> <br /> <br />
                    <input className='input-field' id='share-username'
                        type='text' placeholder='Username...' required autoFocus
                        value={username} onChange={(e) => setUsername(e.target.value.trim())} />
                    <button className='button' type='button' onClick={handleShare}>Share</button>
                    <span className='error-message'>{message}</span>
                </div>
                <div className='received-schemes'>
                    <span className='subtitle'>Accept/Decline Schemes</span> <br /> <br />
                    <div className='received-scheme-list'>
                        {/* TODO: Populate with list of schemes not yet validated */}
                    </div>
                </div>
            </div>
        </div>
    );
}
