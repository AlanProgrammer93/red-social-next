import { Icon, Message, Divider } from 'semantic-ui-react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export const HeaderMessage = () => {
    const router = useRouter();
    const signupRoute = router.pathname === "/signup"

    return <Message 
        color="teal"
        attached 
        header={signupRoute ? "Comenzar" : "Bienvenido"}
        icon={signupRoute ? "settings" : "privacy"}
        content={signupRoute ? "Crear una cuenta" : "Iniciar con email y password"} />
}

export const FooterMessage = () => {
    const router = useRouter();
    const signupRoute = router.pathname === "/signup"

    return (
        <>
            {
                signupRoute ? (
                    <>
                        <Message attached="bottom" warning>
                            <Icon name="help" />
                            ¿usuario existente? <Link href="/login">Inicie sesión aquí</Link>
                        </Message>
                        <Divider hidden />
                    </>
                ) : (
                    <>
                        <Message attached="bottom" info>
                            <Icon name="lock" />
                            <Link href="/reset">Olvidaste tu contraseña?</Link>
                        </Message>

                        <Message attached="bottom" warning>
                            <Icon name="help" />
                            ¿nuevo usuario? <Link href="/signup">Registrarse aquí</Link>
                        </Message>
                    </>
                ) 
            }
        </>
    )
}