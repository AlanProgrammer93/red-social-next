import React from 'react'
import { Form, Button, Message, TextArea, Divider } from 'semantic-ui-react'


const CommonInputs = ({
    user: { bio, facebook, instagram, youtuve, twitter },
    handleChange,
    showSocialLinks,
    setShowSocialLinks
}) => {
    return (
        <>
            <Form.Field
                required
                control={TextArea}
                name="bio"
                value={bio}
                onChange={handleChange}
                placeholder="bio"
            />
            <Button
                content="Agregar redes sociales"
                color="red"
                icon="at"
                type="button"
                onClick={() => setShowSocialLinks(!showSocialLinks)}
            />
            {
                showSocialLinks && (
                    <>
                        <Divider />
                        <Form.Input
                            icon="facebook f"
                            iconPosition="left"
                            name="facebook"
                            value={facebook}
                            onChange={handleChange}
                            />

                        <Form.Input
                            icon="twitter"
                            iconPosition="left"
                            name="twitter"
                            value={twitter}
                            onChange={handleChange}
                            />

                        <Form.Input
                            icon="instagram"
                            iconPosition="left"
                            name="instagram"
                            value={instagram}
                            onChange={handleChange}
                            />

                        <Form.Input
                            icon="youtuve"
                            iconPosition="left"
                            name="youtuve"
                            value={youtuve}
                            onChange={handleChange}
                            />

                        <Message
                            icon="attention"
                            info
                            size="small"
                            header="Redes sociales son opcionales" />
                    </>
                )
            }

        </>
    )
}

export default CommonInputs
