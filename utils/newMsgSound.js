const newMsgSound = senderName => {
    const sound = new Audio('/light.mp3');

    sound && sound.play();

    if (senderName) 
        document.title = `Nuevo Mensaje de ${senderName}`
    
    if (document.visibilityState === 'visible') {
        setTimeout(() => {
            document.title = "Mensajes";
        }, 5000);
    }
}

export default newMsgSound;
