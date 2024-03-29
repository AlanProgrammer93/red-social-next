import React, { useEffect, useRef, useState } from 'react'
import { Form, Button, Message, Segment, Divider } from 'semantic-ui-react'
import CommonInputs from '../components/Common/CommonInputs';
import ImageDropDiv from '../components/Common/ImageDropDiv';
import {HeaderMessage, FooterMessage} from '../components/Common/WelcomeMessage'
import { regexUserName, registerUser } from '../utils/authUser';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';
import uploadPic from '../utils/uploadPicToCloudinary';

let cancel;

const SignUp = () => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        bio: "",
        facebook: "",
        youtube: "",
        twitter: "",
        instagram: ""
    });

    const {name, email, password, bio} = user;

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "media") {
            setMedia(files[0]);
            setMediaPreview(URL.createObjectURL(files[0]));
        }

        setUser(prev => ({ ...prev, [name]: value }));
    }

    const [showSocialLinks, setShowSocialLinks] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(true);

    const [username, setUsername] = useState('');
    const [usernameLoading, setUsernameLoading] = useState(false);
    const [usernameAvailable, setUsernameAvailable] = useState(false);

    const [media, setMedia] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [highlighted, setHighlighted] = useState(false);
    const inputRef = useRef();

    useEffect(() => {
        const isUser = Object.values({name, email, password, bio}).every(item => Boolean(item))
        isUser ? setSubmitDisabled(false) : setSubmitDisabled(true)
    }, [user]);

    const checkUsername = async () => {
        setUsernameLoading(true);
        try {
            cancel && cancel();

            const CancelToken = axios.CancelToken;

            const res = await axios.get(`${baseUrl}/api/signup/${username}`, {
                cancelToken: new CancelToken(canceler => {
                    cancel = canceler;
                })
            });

            if (errorMsg !== null) setErrorMsg(null);
            
            if (res.data === 'Disponible') {
                setUsernameAvailable(true);
                setUser(prev => ({...prev, username}))
            }
        } catch (error) {
            setErrorMsg('Username no valido');
            setUsernameAvailable(false);
        }
        setUsernameLoading(false);
    }

    useEffect(() => {
        username === "" ? setUsernameAvailable(false) : checkUsername();
    }, [username])

    const handleSubmit = async e => {
        e.preventDefault();
        setFormLoading(true);

        let profilePicUrl;
        if (media !== null) {
            profilePicUrl = await uploadPic(media);
        }

        if (media !== null && !profilePicUrl) {
            setFormLoading(false);
            return setErrorMsg("Error al subir imagen");
        }

        await registerUser(user, profilePicUrl, setErrorMsg, setFormLoading);
    }

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
                    <ImageDropDiv 
                        mediaPreview={mediaPreview}
                        setMediaPreview={setMediaPreview}
                        setMedia={setMedia}
                        inputRef={inputRef}
                        highlighted={highlighted}
                        setHighlighted={setHighlighted}
                        handleChange={handleChange}
                    />
                    <Form.Input 
                        required
                        label="Name" 
                        placeholder="Nombre" 
                        name="name" 
                        value={name} 
                        onChange={handleChange}
                        fluid
                        icon="user"
                        iconPosition="left"
                    />
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
                    <Form.Input 
                        loading={usernameLoading}
                        error={!usernameAvailable}
                        required
                        label="Username" 
                        placeholder="Username" 
                        value={username} 
                        onChange={e => {
                            setUsername(e.target.value)
                            if(regexUserName.test(e.target.value)) {
                                setUsernameAvailable(true)
                            } else {
                                setUsernameAvailable(false)
                            }
                        }}
                        fluid
                        icon={usernameAvailable ? "check" : "close"}
                        iconPosition="left"
                    />

                    <CommonInputs 
                        user={user} 
                        showSocialLinks={showSocialLinks} 
                        setShowSocialLinks={setShowSocialLinks}
                        handleChange={handleChange}
                    />

                    <Divider hidden />
                    <Button 
                        icon="signup"
                        content="Registrarse" 
                        type="submit" 
                        color="orange" 
                        disabled={submitDisabled || !usernameAvailable} 
                    />
                 </Segment>
            </Form>

            <FooterMessage />
        </>
    )
}

export default SignUp
