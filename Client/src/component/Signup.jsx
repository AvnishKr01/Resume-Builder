import React, { useContext, useState } from 'react'
import { authStyles as styles } from '../assets/dummystyle'
import { UserContext } from '../Context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import axiosInstance from '../util/axiosIntance'
import { AUTH_PATHS } from '../util/api'
import Input from './Input'

const Signup = ({setCurrentPage}) => {

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [error, setError] = useState(null)

    const {updateUser} = useContext(UserContext)
    const navigate = useNavigate();

    const handleSignup = async(e) => {
        e.preventDefault();
      try {
        const response = await axiosInstance.post(AUTH_PATHS.AUTH.REGISTER, {
            name: fullName,
            email,
            password
        });
        const {token} = response.data;
        if (token) {
            localStorage.setItem('token', token)
            updateUser(response.data)
            navigate('/dashboard')
        }
      } catch (error) {
        console.log(error);
        
      }
    }

  return (
    <div className={styles.signupContainer}>
        <div className={styles.headerWrapper}>
            <h3 className={styles.signupTitle}>Create Account</h3>
            <p className={styles.signupSubtitle}>Join thousand of professional today.</p>
        </div>
        {/* Form  */}
        <form onSubmit={handleSignup}className={styles.signupForm}>
            <Input value={fullName} onChange={({target}) => setFullName(target.value)}
            label='FullName'
            palceholder='John Doe'
            type='text'
            />
            <Input value={email} onChange={({target}) => setEmail(target.value)}
            label='Email'
            palceholder='avi@example.com'
            type='email'
            />
            <Input value={password} onChange={({target}) => setPassword(target.value)}
            label='Password'
            palceholder='1122334455'
            type='password'
            />
            {error && <div className={styles.errorMessage}>{error}</div>}
                <button type='submit' className={styles.signupSubmit}>
                  Create Account
                </button>
                {/* footer  */}
                <p className={styles.switchText}>
                    Already have an account?{' '}
                    <button type="button" onClick={() => setCurrentPage("login")} className={styles.signupSwitchButton}>
                        Sign In
                    </button>
                </p>

        </form>
    </div>
  )
}

export default Signup