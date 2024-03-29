import React, { useEffect, useState } from 'react'
import {Button, Image, List} from 'semantic-ui-react';
import Spinner from '../Layout/Spinner';
import axios from 'axios';
import baseUrl from '../../utils/baseUrl';
import cookie from 'js-cookie';
import {NoFollowData} from '../Layout/NoData';
import {followUser, unfollowUser} from '../../utils/profileActions';

function Following({
    user,
    loggedUserFollowStats,
    setLoggedUserFollowStats,
    profileUserId
}) {
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    useEffect(() => {
        const getFollowing = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${baseUrl}/api/profile/following/${profileUserId}`, {
                    headers: { Authorization: cookie.get("token") }
                })

                setFollowing(res.data);
            } catch (error) {
                alert("Error al leer seguidores");
            }
            setLoading(false);
        }
        getFollowing();
    }, [])

    return (
        <>
            {
                loading ? (
                    <Spinner />
                ) : (
                    following.length > 0 ? (
                        following.map(profileFollowing => {
                            const isFollowing =
                                loggedUserFollowStats.following.length > 0 &&
                                loggedUserFollowStats.following.filter(
                                    following => following.user === profileFollowing.user._id
                                ).length > 0;
    
                            return (
                                <>
                                    <List key={profileFollowing.user._id} divided verticalAlign="middle">
                                        <List.Item>
                                            <List.Content floated="right">
                                                {profileFollowing.user._id !== user._id && (
                                                    <Button
                                                        color={isFollowing ? "instagram" : "twitter"}
                                                        content={isFollowing ? "Siguiendo" : "Seguir"}
                                                        icon={isFollowing ? "check" : "add aser"}
                                                        disabled={followLoading}
                                                        onClick={async () => {
                                                            setFollowLoading(true);
                                                            isFollowing
                                                                ? await unfollowUser(
                                                                    profileFollowing.user._id,
                                                                    setLoggedUserFollowStats
                                                                  )
                                                                : await followUser(
                                                                    profileFollowing.user._id,
                                                                    setLoggedUserFollowStats
                                                                  );
                                                            setFollowLoading(false);
                                                        }} 
                                                    />
                                                )}
                                            </List.Content>
                                            <Image avatar src={profileFollowing.user.profilePicUrl} />
                                            <List.Content as="a" href={`/${profileFollowing.user.username}`}>
                                                {profileFollowing.user.name}
                                            </List.Content>
                                        </List.Item>
                                    </List>
                                </>
                            )
                        })
                    ) : (
                        <NoFollowData followingComponent={true} />
                    )
                )
            }
        </>
    )
}

export default Following
