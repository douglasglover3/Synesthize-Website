import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EDOSystem } from '../Classes/EDOSystem';
import { isDefaultScheme } from '../Classes/SchemeFunctions';
import defaultSchemes from '../schemes/defaultSchemes'; 
import SchemeShareSidebar from './SchemeShareSidebar';

type Scheme = {
	name: string,
	notes: string[]
}

export default function SchemeDropdown({ setSchemeInMain, setCookie, cookies }) {
	let _12tEDO = new EDOSystem(12);
	let userSchemes = [];

	// TODO: Retrieve schemes from database or cookies depending on if user is logged in
	if (localStorage.getItem('synesthizeUserData')) {

	}
	else {
		if(cookies.schemeList !== undefined)
			userSchemes = cookies.schemeList
	}
		
	const [schemes, setSchemes] = useState(defaultSchemes.concat(userSchemes))

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
			// TODO: Delete scheme from database or cookies depending on if user is logged in
			let schemeArray = [];

			if (localStorage.getItem('synesthizeUserData')) {

			}
			else {
				schemeArray = cookies.schemeList;
			}

			schemeArray = schemeArray.filter(scheme => scheme !== selectedScheme);
			setSchemes(defaultSchemes.concat(schemeArray));
			setMessage('Scheme was successfully deleted');
			setSelectedScheme(schemes[0]);

			// TODO: Update database or cookies depending on if user is logged in
			if (localStorage.getItem('synesthizeUserData')) {

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

	// TODO: Send this scheme to user with <username>
	const shareScheme = (): void => {
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

		setShareMessage('Scheme successfully shared');
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
