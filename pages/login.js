import React, { useEffect, useRef, useState } from 'react'
import { Form, Button, Message, Segment, TextArea, Divider } from 'semantic-ui-react'
import {HeaderMessage, FooterMessage} from '../components/Common/WelcomeMessage'
import { loginUser } from '../utils/authUser';
import cookie from 'js-cookie';

const Login = () => {
    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const {email, password} = user;

    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setUser(prev => ({ ...prev, [name]: value }));
    }

    useEffect(() => {
        const isUser = Object.values({email, password}).every(item => Boolean(item))
        isUser ? setSubmitDisabled(false) : setSubmitDisabled(true)
    }, [user]);

    const handleSubmit = async e => {
        e.preventDefault();

        await loginUser(user, setErrorMsg, setFormLoading);
    }

    useEffect(() => {
        document.title = "Bienvenido"
        const userEmail = cookie.get('userEmail');
        if (userEmail) setUser(prev => ({...prev, email: userEmail}))
    }, [])

    return (
        <>
            <HeaderMessage />
            <Form
                loading={formLoading}
                error={errorMsg !== null}
                onSubmit={handleSubmit}
             >
                <Message 
                    error 
                    header="Error!" 
                    content={errorMsg}
                    onDismiss={() => setErrorMsg(null)}
                 />

                 <Segment>
                    <Form.Input 
                        required
                        label="Email" 
                        placeholder="Email" 
                        name="email" 
                        value={email} 
                        onChange={handleChange}
                        fluid
                        icon="envelope"
                        iconPosition="left"
                        type="email"
                    />
                    <Form.Input 
                        label="Password" 
                        placeholder="Contraseña" 
                        name="password" 
                        value={password} 
                        onChange={handleChange}
                        fluid
                        icon={{
                            name: 'eye',
                            circular: true,
                            link: true,
                            onClick: () => setShowPassword(!showPassword)
                        }}
                        iconPosition="left"
                        required
                        type={showPassword ? 'text' : 'password'}
                    />

                    <Divider hidden />
                    <Button 
                        icon="signup"
                        content="Iniciar" 
                        type="submit" 
                        color="orange" 
                        disabled={submitDisabled} 
                    />
                 </Segment>
            </Form>

            <FooterMessage />
        </>
    )
}

export default Login
