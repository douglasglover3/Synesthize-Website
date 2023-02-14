import '../css/AddEditScheme.css';
import '../css/Sidebar.css';

export default function SchemeShareSidebar({ sidebarOpen, setSidebarOpenInParent }) {
    // Close out lightbox and reset any data
    const closeSidebar = (): void => {
        setSidebarOpenInParent(false);
    }

    // Lightbox is only visible when selected
    return(
        <div className='sidebar' style={sidebarOpen ? {display: 'block'} : {display: 'none'}}>
            <label id='close-button' onClick={closeSidebar}>&times;</label>
            <div className='received-schemes'>
                <span id='accept-decline-schemes' className='subtitle'>Accept/Decline Schemes</span> <br /> <br />
                <div className='received-scheme-list'>
                    {/* TODO: Populate with list of schemes not yet validated */}
                </div>
            </div>
        </div>
    );
}
