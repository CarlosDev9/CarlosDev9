import React, { useState } from 'react';

function UserAuth({ onLogin, onLogout, isLoggedIn, username }) {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccessMessage, setIsSuccessMessage] = useState(false); 

  // Neuer Benutzer registrieren
  const handleRegister = () => {
    const newUser = { username: usernameInput, password: passwordInput };

       // testen ob der Benutzer existiert
    
    if(newUser.username==='' || newUser.password===''){
      alert('Bitte füllen Sie alle Felder')
    }else{
      fetch('https://json-server-i8eu.onrender.com/users')
      .then(res => res.json())
      .then(users => {
        const userExists = users.some(user => user.username === newUser.username);
        if (userExists) {
          setErrorMessage('Benutzer existiert bereits');
          setIsSuccessMessage(false); 
        } else {
          // Neuer Benutzer registrieren
          fetch('https://json-server-i8eu.onrender.com/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser),
          })
            .then(() => {
              setErrorMessage('Erfolgreiche Registrierung. Jetzt können Sie sich anmelden.');
              setIsSuccessMessage(true); 
            })
            .catch(() => {
              setErrorMessage('Anmeldefehler');
              setIsSuccessMessage(false); 
            });
        }
      });
  };
}


  // Anmeldefunktion
  const handleLogin = () => {
    fetch('https://json-server-i8eu.onrender.com/users')
      .then(res => res.json())
      .then(users => {
        const user = users.find(
          u => u.username === usernameInput && u.password === passwordInput
        );
        if (user) {
          onLogin(usernameInput);
          setErrorMessage('');
        } else {
          setErrorMessage('Falsche Anmeldedaten');
          setIsSuccessMessage(false); 
        }
      })
      .catch(() => {
        setErrorMessage('Anmeldefehler');
        setIsSuccessMessage(false); 
      });
  };

  return (
    <div className='form-auth'>
      {isLoggedIn ? (
        <div>
          <button onClick={onLogout}>Abmelden</button>
        </div>
      ) : (
        <div className='user-auth'>
          <h4 className='login-h4'>Bitte melden Sie sich an um kommentare schreiben zu können. Falls Sie noch kein Konto besitzen registrieren Sie sich</h4>
          <input
            className='input-auth'
            type="text"
            placeholder="Benutzername"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
          />
          <input
            className='input-auth'
            type="password"
            placeholder="Passwort"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
           <button className='btn-auth' onClick={handleLogin}>Anmelden</button>
           <button className='btn-auth register'onClick={handleRegister}>Registrieren</button>


          {/* Zeigt die Fehler- oder Erfolgsmeldung in verschiedenen Stilen an */}
          {errorMessage && (
            <p
              style={{
                color: isSuccessMessage ? 'green' : 'red',
              }}
            >
              {errorMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default UserAuth;
