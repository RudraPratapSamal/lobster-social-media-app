import {NavLink} from "react-router-dom"
import NavItem from './NavItem';
export default function SettingsNavigationBar(){
    
    return(
        <>
            <div id="setting-nav">
                <ul>
                    <li>
                        <NavLink to='/account-settings/edit-account-details' className='settings-nav-links'>
                            <NavItem icon={null} title='Edit Profile'/>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/account-settings/delete-account' className='settings-nav-links'>
                            <NavItem icon={null} title='Delete Account'/>
                        </NavLink>
                    </li>
                </ul>
            </div>
        </>
    )
}