import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../styling/Navbar.css'
import axios from 'axios';
import logo from '../image/Logo.png'
// made in logo.com

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

    // for responsive nav bar
    // Lama code (2022) Create a Responsive Hamburger Menu using only HTML and CSS | Responsive Navigation Menu. 
    // Available at:https://www.youtube.com/watch?v=QQlxvj_GKss (Accessed 10 February 2025).
    return (
        <>
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

                {/* OpenAI. (2025). ChatGPT (20 February Version) [Large Language Model]. Available at: https://chatgpt.com/ (Accessed: 20 February 2025). */}
                {/* used chatgpt to find out, how to manage clicking 3 lines */}
                <div id='threeLines' onClick={() => setMenue(!menue)}>
                    <p>&#9776;</p>
                </div>
            </nav>
            {/* </div> */}

        </>
    )

}

