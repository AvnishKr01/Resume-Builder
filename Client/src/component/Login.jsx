import React, { useContext, useState } from 'react'
import { authStyles as styles } from '../assets/dummystyle'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../util/axiosIntance'
import { AUTH_PATHS } from '../util/api'
import Input from './Input'
import { UserContext } from '../Context/UserContext'

const Login = ({setCurrentPage}) => {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [error, setError] = useState(null)

    const {updateUser} = useContext(UserContext)
    const navigate = useNavigate();

    const handleLogin = async(e) => {
        e.preventDefault();
      try {
        const response = await axiosInstance.post(AUTH_PATHS.AUTH.LOGIN, {
            email,
            password
        });
        const {token} = response.data;
        if (token) {
            localStorage.setItem('token', token)
            updateUser(response.data)
            navigate('/dashboard')
            console.log("login");
            
        }
      } catch (error) {
        console.log(error);
        
      }
    }
  return (
    <div className={styles.container}>
        <div className={styles.headerWrapper}>
            <h3 className={styles.signupTitle}>Welcome Back</h3>
            <p className={styles.signupSubtitle}>Sign in to continue amazing resumes</p>
        </div>
        {/* Form  */}
        <form onSubmit={handleLogin}className={styles.signupForm}>
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
                  Sign In
                </button>
                {/* footer  */}
                <p className={styles.switchText}>
                    Already have an account?{' '}
                    <button type="button" onClick={() => setCurrentPage("signup")} className={styles.signupSwitchButton}>
                        Sign Up
                    </button>
                </p>
        </form>
    </div>
  )
}

export default Login