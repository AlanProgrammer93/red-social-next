import React, { useEffect, useRef, useState } from 'react'
import {Form, Button, Divider, Message, List, Checkbox} from 'semantic-ui-react';
import { passwordUpdate, toggleMessagePopup } from '../../utils/profileActions';

function Settings({newMessagePopup}) {
    const [showUpdatePassword, setShowUpdatePassword] = useState(false);
    const [success, setSuccess] = useState(false);

    const [showMessageSettings, setShowMessageSettings] = useState(false);
    const [popupSetting, setPopupSetting] = useState(newMessagePopup);

    const isFirstRun = useRef(true);

    useEffect(() => {
        success && setTimeout(() => setSuccess(false), 3000);
    }, [success]);

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
    }, [popupSetting])

    return (
        <>
            {
                success && (
                    <>
                        <Message
                            icon="check circle"
                            header="Actualizado Correctamente"
                            success 
                        />
                        <Divider hidden />
                    </>
                )
            }

            <List size="huge" animated>
                <List.Item>
                    <List.Icon 
                        name="user secret" 
                        size="large" 
                        verticalAlign="middle" 
                    />
                    <List.Content>
                        <List.Header
                            as="a"
                            onClick={() => setShowUpdatePassword(!showUpdatePassword)}
                            content="Modificar Contraseña" 
                        />
                    </List.Content>
                    {
                        showUpdatePassword && (
                            <UpdatePassword
                                setSuccess={setSuccess}
                                setShowUpdatePassword={setShowUpdatePassword} 
                            />
                        )
                    }
                </List.Item>
                <Divider />

                <List.Item>
                    <List.Icon
                        name="paper plane outline"
                        size="large"
                        verticalAlign="middle" 
                    />
                    <List.Content>
                        <List.Header 
                            onClick={() => setShowMessageSettings(!showMessageSettings)}
                            as="a"
                            content="Mostrar alerta de nuevo mensaje?" 
                        />
                    </List.Content>

                    {
                        showMessageSettings && (
                            <div style={{marginTop: "10px"}}>
                                controlar si debe aparecer una ventana emergente cuando hay un mensaje nuevo?
                                <br />
                                <br />
                                <Checkbox 
                                    checked={popupSetting}
                                    toggle
                                    onChange={() => 
                                        toggleMessagePopup(popupSetting, setPopupSetting, setSuccess)
                                    } 
                                />
                            </div>
                        )
                    }
                </List.Item>
            </List>
        </>
    )
}

const UpdatePassword = ({setSuccess, setShowUpdatePassword}) => {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [userPasswords, setUserPasswords] = useState({
        currentPassword: "", 
        newPassword: ""
    });

    const [showTypedPassword, setShowTypedPassword] = useState({
        field1: false,
        field2: false
    });

    const {currentPassword, newPassword} = userPasswords;
    const {field1, field2} = showTypedPassword;

    const handleChange = e => {
        const {name, value} = e.target;
        setUserPasswords(prev => ({...prev, [name]: value}));
    }

    useEffect(() => {
        errorMsg !== null && setTimeout(() => setErrorMsg(null), 5000);
    }, [errorMsg])

    return (
        <>
            <Form 
                error={errorMsg !== null} 
                loading={loading}
                onSubmit={async e => {
                    e.preventDefault();
                    setLoading(true);

                    await passwordUpdate(setSuccess, userPasswords);
                    setLoading(false);

                    setShowUpdatePassword(false);
                }} 
            >
                <List.List>
                    <List.Item>
                        <Form.Input 
                            fluid 
                            icon={{
                                name: "eye",
                                circular: true,
                                link: true,
                                onClick: () =>
                                    setShowTypedPassword(prev => ({ ...prev, field1: !field1 }))
                            }}
                            type={field1 ? "text" : "password"}
                            iconPosition = "left"
                            label = "Current Password"
                            placeholder = "Ingrese Contraseña Actual"
                            name = "currentPassword"
                            onChange = {handleChange}
                            value = {currentPassword} 
                        />

                        <Form.Input 
                            fluid 
                            icon={{
                                name: "eye",
                                circular: true,
                                link: true,
                                onClick: () =>
                                    setShowTypedPassword(prev => ({ ...prev, field2: !field2 }))
                            }}
                            type={field2 ? "text" : "password"}
                            iconPosition = "left"
                            label = "New Password"
                            placeholder = "Ingrese Nueva Contraseña"
                            name="newPassword"
                            onChange={handleChange}
                            value={newPassword} 
                        />

                        <Button 
                            disabled={loading || newPassword === "" || currentPassword === ""}
                            compact
                            icon = "configure"
                            type="submit"
                            color="teal"
                            content="Confirmar" 
                        />

                        <Button
                            disabled={loading}
                            compact
                            icon="cancel"
                            content="Cancelar"
                            onClick={() => setShowUpdatePassword(false)} 
                        />

                        <Message
                            error
                            icon="meh"
                            header="Error"
                            content={errorMsg} 
                        />
                    </List.Item>
                </List.List>

            </Form>
            <Divider hidden />
        </>
    )

}

export default Settings
