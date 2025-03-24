import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../styling/Navbar.css'
import axios from 'axios';
import logo from '../image/Logo.png'

// https://stackoverflow.com/questions/34693811/where-do-i-get-a-3-horizontal-lines-symbol-for-my-webpage to get the 3 lines
// https://www.youtube.com/watch?v=QQlxvj_GKss for responsive nav bar

export default function Navbar({ sessionAvailability, setSessionAvailability, userPoints }) {

    const navigate = useNavigate();

    const [menue, setMenue] = useState(false);

    const remove = (async () => {

        try {
            const res = await axios.get('http://localhost:8000/remove_session');

            if (res.data.available === false) {
                setSessionAvailability(false);
                navigate('/');
            }
        }
        catch (e) {
            console.log("Error when getting request", e)
        }
    })

    return (
        <>
            {/* header from chatGPT 
        prompt: the thing is, I want the logo to be a part of the navbar, but at the top in the center 24/02/2025 */}
            <header id="navbarContainer">

                <div id='Logo'><img id='logoImage' src={logo} /></div>
                <nav id='navbar'>
                    <ul id='listOfLinks' className={menue ? "active" : ""}>
                        <li className='links'><Link to={'/'}>Home</Link></li>
                        <li className='links'><Link to={'/food_labels'}>Labels</Link></li>

                        {!sessionAvailability ?
                            (<>
                                <li className='links'><Link to={'/signup'}>SignUp</Link></li>
                                <li className='links'><Link to={'/login'}>Login</Link></li>
                            </>) :
                            (<>

                                <div className='dropdownDiv'>
                                    <a className='links'>Shop</a>
                                    <ul className='dropdownMenue'>
                                        <li className='links'><Link to={'/e_commerce'}>E-Commerce</Link></li>
                                        <li className='links'><Link to={'/receipt'}>Receipt</Link></li>
                                    </ul>
                                </div>

                                <div className='dropdownDiv'>
                                    <a className='links'>Donation</a>
                                    <ul className='dropdownMenue'>
                                        <li className='links'><Link to={'/donate'}>Donation</Link></li>
                                        <li className='links'><Link to={'/update_donation'}>Update Donation</Link></li>
                                    </ul>
                                </div>

                                <div className='dropdownDiv'>
                                    <a className='links'>Reservation</a>
                                    <ul className='dropdownMenue'>
                                        <li className='links'><Link to={'/reserve_donation'}>Reserve Donation</Link></li>
                                        <li className='links'><Link to={'/update_reserved_donation'}>Update Reserve Donation</Link></li>
                                    </ul>
                                </div>

                                <li className='links'><Link onClick={remove}>Sign out</Link></li>

                                <li className='links' id='userPoints'><Link>Points: {userPoints} </Link></li>
                            </>
                            )}
                    </ul>
                    {/* used chatgpt to find out, how to manage clicking 3 lines */}
                    <div id='threeLines' onClick={() => setMenue(!menue)}>
                        <p>&#9776;</p>
                    </div>
                </nav>
            </header>

        </>
    )

}

