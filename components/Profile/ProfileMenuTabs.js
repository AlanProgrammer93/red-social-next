import React from 'react'
import {Menu} from 'semantic-ui-react';

function ProfileMenuTabs({
    activeItem,
    handleItemClick,
    followersLength,
    followingLength,
    ownAccount,
    loggedUserFollowStats
}) {
    return (
        <>
            <Menu pointing secondary>
                <Menu.Item
                    name="profile"
                    active={activeItem === "profile"}
                    onClick={() => handleItemClick("profile")} 
                />
                {
                    ownAccount ? (
                        <>
                            <Menu.Item
                                name={`${
                                    loggedUserFollowStats.followers.length > 0
                                        ? loggedUserFollowStats.followers.length
                                        : 0
                                } Seguidores`}
                                active={activeItem === "followers"}
                                onClick={() => handleItemClick("followers")} 
                            />

                            <Menu.Item
                                name={`${
                                    loggedUserFollowStats.following.length > 0
                                        ? loggedUserFollowStats.following.length
                                        : 0
                                } Seguidos`}
                                active={activeItem === "following"}
                                onClick={() => handleItemClick("following")} 
                            />
                        </>
                    ) : (
                        <>
                            <Menu.Item
                                name={`${followersLength} Seguidores`}
                                active={activeItem === "followers"}
                                onClick={() => handleItemClick("followers")} 
                            />

                            <Menu.Item
                                name={`${followingLength} Seguidos`}
                                active={activeItem === "following"}
                                onClick={() => handleItemClick("following")} 
                            />
                        </>
                    )
                }
                {
                    ownAccount && (
                        <>
                            <Menu.Item
                                name="Editar Perfil"
                                active={activeItem === "updateProfile"}
                                onClick={() => handleItemClick("updateProfile")} 
                            />

                            <Menu.Item
                                name="Configuraciones"
                                active={activeItem === "settings"}
                                onClick={() => handleItemClick("settings")} 
                            />
                        </>
                    )
                }
            </Menu>
        </>
    )
}

export default ProfileMenuTabs
