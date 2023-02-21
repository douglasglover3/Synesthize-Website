import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EDOSystem } from '../Classes/EDOSystem';
import { isDefaultScheme } from '../Classes/SchemeFunctions';
import defaultSchemes from '../schemes/defaultSchemes'; 
import SchemeShareSidebar from './SchemeShareSidebar';
import * as API from "../functions/API";

type Scheme = {
	name: string,
	notes: string[]
}

export default function SchemeDropdown({ setSchemeInMain, setCookie, cookies }) {
	let _12tEDO = new EDOSystem(12);

	// Get <userSchemes> at first render either from database or cookies
	const [userSchemes, setUserSchemes] = useState([]);
	useEffect(() => {
		// User logged in, retrieve from database
		if (localStorage.getItem('synesthizeUserData')) {
			const userId = JSON.parse(localStorage.getItem('synesthizeUserData')).userId;
			API.getValidSchemes({userId})
				.then((ret) => setUserSchemes(ret.validSchemes));
		}
		// User not logged in, retrieve from cookies
		else {
			if(cookies.schemeList !== undefined)
				setUserSchemes(cookies.schemeList);
		}

		console.log('here');
	}, [cookies.schemeList]);

	// Whenever <userSchemes> is updated, update the full <schemes> list
	const [schemes, setSchemes] = useState(defaultSchemes.concat(userSchemes));
	useEffect(() => {
		setSchemes(defaultSchemes.concat(userSchemes));
	}, [userSchemes]);

	let toneList = _12tEDO.getToneList();
	let ind = 0;

	const navigate = useNavigate();

	let [selectedScheme, setSelectedScheme] = useState(schemes[0]);
	let [message, setMessage] = useState('');

	const [username, setUsername] = useState('');
	const [shareMessage, setShareMessage] = useState('');
	

	// For viewing one's received schemes
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const openSidebar = (e): void => {
		setSidebarOpen(true);
	}

    // Set <currScheme> for both <SchemeDropdown /> and <MainWindow />
    const handleSchemeChange = (e): void => {
        let index: number = parseInt((e.target as HTMLSelectElement).value);
        setSelectedScheme(schemes[index]);

		// Reset any error messages
		setMessage('');
		setShareMessage('');
    }
	useEffect(() => {
		setSchemeInMain(selectedScheme);
		// eslint-disable-next-line
	}, [selectedScheme]);

	const addScheme = (): void => {
		navigate('/AddSchema');
	}

	const handleDelete = (): void => {
		// Don't let user delete default schemes
		if (isDefaultScheme(selectedScheme.name)) {
			setMessage('Sorry! Can\'t delete default schemes');
			return;
		}

		let confirmDelete = window.confirm('Are you sure you want to delete this scheme?');
		if (confirmDelete) {
			// Delete scheme from database or cookies depending on if user is logged in
			let schemeArray = userSchemes.filter(scheme => scheme !== selectedScheme);
			setUserSchemes(schemeArray);
			setMessage('Scheme was successfully deleted');
			setSelectedScheme(schemes[0]);

			// Update database or cookies depending on if user is logged in
			if (localStorage.getItem('synesthizeUserData')) {
				const userId = JSON.parse(localStorage.getItem('synesthizeUserData')).userId;
				const name = selectedScheme.name;
				API.deleteScheme({userId, name});
			}
			else {
				setCookie("schemeList", schemeArray, { path: "/"});
			}
		}
	}

	const handleEdit = (): void => {
		// Don't let user edit default schemes
		if (isDefaultScheme(selectedScheme.name)) {
			setMessage('Sorry! Can\'t edit default schemes');
			return;
		}

		navigate('/EditSchema', {state:{scheme: selectedScheme}});
	}

	// Send this scheme to user with <username>
	const shareScheme = async () => {
		// Don't let user share default schemes
		if (isDefaultScheme(selectedScheme.name)) {
			setShareMessage('Sorry! Can\'t share default schemes');
			return;
		}

		// Make sure <username> field is filled out
		if (username.trim() === '') {
			setShareMessage('Please fill in the username field');
			return;
		}

		try {
			const name = selectedScheme.name;
			const notes = selectedScheme.notes;
			await API.shareScheme({username, name, notes});
			setUsername('');
			setShareMessage('Scheme successfully shared');
		}
		catch(apiError) {
			setShareMessage(apiError.message);
		}
	}

    return(
        <div>
			<div className='subsection'>
				<select className='select-box' onChange={ handleSchemeChange }>
					{schemes.map((scheme: Scheme) => <option key={ ind } value={ ind++ }>{ scheme.name }</option>)}
				</select>
				<button type="button" className='button' onClick={ addScheme }>+</button>
			</div>
			<div className='subsection'>
				<button type="button" className='button' onClick={ handleEdit }>Edit Scheme</button>
				<button type="button" className='button' onClick={ handleDelete }>Delete Scheme</button>
			</div>
			<div className='subsection'>
				<div className='color-block' style={{backgroundColor:selectedScheme.notes[toneList.C]}} />
				<div className='color-block' style={{backgroundColor:selectedScheme.notes[toneList.D]}} />
				<div className='color-block' style={{backgroundColor:selectedScheme.notes[toneList.E]}} />
				<div className='color-block' style={{backgroundColor:selectedScheme.notes[toneList.F]}} />
				<div className='color-block' style={{backgroundColor:selectedScheme.notes[toneList.G]}} />
				<div className='color-block' style={{backgroundColor:selectedScheme.notes[toneList.A]}} />
				<div className='color-block' style={{backgroundColor:selectedScheme.notes[toneList.B]}} />
			</div>
			<div>
				<span className='scheme-message'>{message}</span>
			</div> <br />
			<div>
				<input type='text' id='scheme-share-input' className='input-field' placeholder='Username to share...'
					value={username} onChange={(e) => setUsername(e.target.value.trim())} />
				<button type='button' id='scheme-share-button' className='button' onClick={shareScheme}>
					Share Scheme
				</button>
			</div>
			<div>
				<span className='scheme-message'>{shareMessage}</span>
			</div> <br /> <br />
			<button type='button' id='scheme-share-button' className='button' onClick={ openSidebar }>Received Schemes</button>
				<SchemeShareSidebar sidebarOpen={sidebarOpen} setSidebarOpenInParent={setSidebarOpen} />
        </div>
    );
}
