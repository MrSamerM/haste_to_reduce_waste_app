import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styling/Navbar.css'
import axios from 'axios';

// https://stackoverflow.com/questions/34693811/where-do-i-get-a-3-horizontal-lines-symbol-for-my-webpage to get the 3 lines
// https://www.youtube.com/watch?v=QQlxvj_GKss for responsive nav bar

export default function Navbar({ sessionAvailability, setSessionAvailability }) {

    const navigate = useNavigate();

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
            <nav id='navbar'>
                <ul id='listOfLinks'>
                    <li className='links'><Link to={'/'}>Home</Link></li>
                    <li className='links'><Link to={'/food_labels'}>Labels</Link></li>

                    {!sessionAvailability ?
                        (<>
                            <li className='links'><Link to={'/signup'}>SignUp</Link></li>
                            <li className='links'><Link to={'/login'}>Login</Link></li>
                        </>) :
                        (<>
                            <li className='links'><Link to={'/e_commerce'}>E-Commerce</Link></li>
                            <li className='links'><Link to={'/donate'}>Donation</Link></li>
                            <li className='links'><Link to={'/reserve_donation'}>Reserve Donation</Link></li>
                            <li className='links'><Link to={'/update_donation'}>Update Donation</Link></li>
                            <li className='links'><Link to={'/update_reserved_donation'}>Update Reserve Donation</Link></li>
                            <li className='links'><Link to={'/update_donation_details'}>Update Donation Details</Link></li>
                            <li className='links'><Link onClick={remove}>Sign out</Link></li>
                        </>
                        )}
                </ul>
            </nav>
        </>
    )

}

