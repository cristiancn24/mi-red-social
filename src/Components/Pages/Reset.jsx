import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';

const Reset = () => {
const [email, setEmail] = useState('');

  return (
    <div className='grid grid-cols-1 justify-items-center items-center h-screen'>
      <div className='w-96'>
        <Typography 
        variant='h6' 
        color='blue-gray' 
        className='pb-4'>
          Enter the email address associated with your account, and we’ll email you a link to reset your password.
        </Typography>
        <TextField 
        id="email" 
        name='email' 
        label="Email" 
        variant="outlined" 
        fullWidth
        value={email} 
        onChange={(e) => setEmail(e.target)}/>
        <div className='mt-4'>
        <Button variant='contained' fullWidth>
          Continue
        </Button>
        </div>
        
      </div>
    </div>
  )
}

export default Reset