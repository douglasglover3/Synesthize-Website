import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EDOSystem } from '../Classes/EDOSystem';
import { isDefaultScheme } from '../Classes/SchemeFunctions';
import defaultSchemes from '../schemes/defaultSchemes'; 
import SchemeShareLightbox from './SchemeShareLightbox';

type Scheme = {
	name: string,
	notes: string[]
}

export default function SchemeDropdown({ setSchemeInMain, setCookie, cookies}) {
	let _12tEDO = new EDOSystem(12);
	let cookieSchemes = [];
	//if cookies exist, load them
	if(cookies.schemeList !== undefined)
		cookieSchemes = cookies.schemeList
		
	const [schemes, setSchemes] = useState(defaultSchemes.concat(cookieSchemes))

	let toneList = _12tEDO.getToneList();
	let ind = 0;

	const navigate = useNavigate();

	let [selectedScheme, setSelectedScheme] = useState(schemes[0]);
	let [message, setMessage] = useState('');

	// For handling the share-scheme lightbox
	const [lightboxVisible, setLightboxVisible] = useState(false);

	const handleLightboxOpen = (e): void => {
		// Don't let user share default schemes
		if (!isDefaultScheme(selectedScheme.name)) {
			setMessage('Sorry! Can\'t share default schemes');
			return;
		}

		setLightboxVisible(!lightboxVisible);
	}

    // Set <currScheme> for both <SchemeDropdown /> and <MainWindow />
    const handleSchemeChange = (e): void => {
        let index: number = parseInt((e.target as HTMLSelectElement).value);
        setSelectedScheme(schemes[index]);

		// Reset any error messages
		setMessage('');
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
			let schemeArray = cookies.schemeList;
			schemeArray = schemeArray.filter(scheme => scheme !== selectedScheme);
    		setCookie("schemeList", schemeArray, { path: "/"});
			setSchemes(defaultSchemes.concat(schemeArray));
			setMessage('Scheme was successfully deleted');
			setSelectedScheme(schemes[0]);
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
			<div className='subsection'>
				<span className='scheme-message'>{message}</span>
			</div> <br /> <br />
			<button type='button' className='button' onClick={ handleLightboxOpen }>Share and Receive Schemes</button>
				<SchemeShareLightbox lightboxVisible={lightboxVisible} setLightboxVisibleInParent={setLightboxVisible}
					scheme={ selectedScheme } />
        </div>
    );
}
