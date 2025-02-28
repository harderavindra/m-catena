import React, { useContext } from 'react'
import InputText from './InputText'
import { useState } from 'react'
import Button from './Button'
import ValidationMessage from "../ui/ValidationMessage"
import { validatePassword } from '../../utils/validation'
import { resetPassword } from '../../api/userApi'
import { AuthContext } from '../../contexts/AuthContext'

const AdminResetPassword = ({userId}) => {
        const { user } = useContext(AuthContext);
    
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
    const handleReset = async () =>{
        console.log(password)
        setMessage('')
        // if (!validatePassword(password)) {
        //     setMessage("Password must be at least 6 characters long.");
        //     return;
        //   }
        // if (password !== confirmPassword) {
        //     setMessage("Passwords do not match");
        //     return; // Exit early if passwords don't match
        //   }
          try {
            resetPassword(userId, password);
            setMessage("Password reset successfully");

          } catch (error) {
            setMessage(error.response?.data?.message || "Error resetting password");
          }
         
    }
  return (
    <div>
        <InputText type='password' name='password' value={password} handleOnChange={(e)=>setPassword(e.target.value)}/>
        <InputText type='password' name='confirmPassword' value={confirmPassword} handleOnChange={(e)=>setConfirmPassword(e.target.value)}/>
        <Button onClick={handleReset}>Reset</Button>
        {message && (<ValidationMessage>{message}</ValidationMessage>)}
    </div>
  )
}

export default AdminResetPassword