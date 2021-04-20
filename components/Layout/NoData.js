import { Message, Button } from "semantic-ui-react";

export const NoProfilePosts = () => (
  <>
    <Message info icon="meh" header="Lo Sentimos" content="El usuario no ha publicado nada todavía!" />
    <Button icon="long arrow alternate left" content="Volver Atras" as="a" href="/" />
  </>
);

export const NoFollowData = ({ followersComponent, followingComponent }) => (
  <>
    {followersComponent && (
      <Message icon="user outline" info content="El usuario no tiene seguidores" />
    )}

    {followingComponent && (
      <Message icon="user outline" info content="El usuario no sigue a ningún usuario" />
    )}
  </>
);

export const NoMessages = () => (
  <Message
    info
    icon="telegram plane"
    header="Lo Sentimos"
    content="Aún no has enviado un mensaje a nadie."
  />
);

export const NoPosts = () => (
  <Message
    info
    icon="meh"
    header="Hey!"
    content="No hay publicaciones. Asegúrate de haber seguido a alguien."
  />
);

export const NoProfile = () => (
  <Message info icon="meh" header="Hey!" content="Perfil No Encontrado." />
);

export const NoNotifications = () => (
  <Message content="No Hay Notificaciones" icon="smile" info />
);

export const NoPostFound = () => (
  <Message info icon="meh" header="Hey!" content="Post No Encontrado." />
);