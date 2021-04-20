import React, { useEffect, useState } from 'react'
import {Button, Image, List} from 'semantic-ui-react';
import Spinner from '../Layout/Spinner';
import axios from 'axios';
import baseUrl from '../../utils/baseUrl';
import cookie from 'js-cookie';
import {NoFollowData} from '../Layout/NoData';
import {followUser, unfollowUser} from '../../utils/profileActions';

function Followers({
    user,
    loggedUserFollowStats,
    setLoggedUserFollowStats,
    profileUserId
}) {
    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    useEffect(() => {
        const getFollowers = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${baseUrl}/api/profile/followers/${profileUserId}`, {
                    headers: { Authorization: cookie.get("token") }
                })

                setFollowers(res.data);
            } catch (error) {
                alert("Error al leer seguidores");
            }
            setLoading(false);
        }
        getFollowers();
    }, [])

    return (
        <>
            {
                loading ? (
                    <Spinner />
                ) : (
                    followers.length > 0 ? (
                        followers.map(profileFollower => {
                            const isFollowing =
                                loggedUserFollowStats.following.length > 0 &&
                                loggedUserFollowStats.following.filter(
                                    following => following.user === profileFollower.user._id
                                ).length > 0;
    
                            return (
                                <>
                                    <List key={profileFollower.user._id} divided verticalAlign="middle">
                                        <List.Item>
                                            <List.Content floated="right">
                                                {profileFollower.user._id !== user._id && (
                                                    <Button
                                                        color={isFollowing ? "instagram" : "twitter"}
                                                        content={isFollowing ? "Siguiendo" : "Seguir"}
                                                        icon={isFollowing ? "check" : "add aser"}
                                                        disabled={followLoading} 
                                                        onClick={async () => {
                                                            setFollowLoading(true);
                                                            isFollowing
                                                                ? await unfollowUser(
                                                                    profileFollower.user._id,
                                                                    setLoggedUserFollowStats
                                                                  )
                                                                : await followUser(
                                                                    profileFollower.user._id,
                                                                    setLoggedUserFollowStats
                                                                  );
                                                            setFollowLoading(false);
                                                        }}
                                                    />
                                                )}
                                            </List.Content>
                                            <Image avatar src={profileFollower.user.profilePicUrl} />
                                            <List.Content as="a" href={`/${profileFollower.user.username}`}>
                                                {profileFollower.user.name}
                                            </List.Content>
                                        </List.Item>
                                    </List>
                                </>
                            )
                        })
                    ) : (
                        <NoFollowData followersComponent={true} />
                    )
                )
            }
        </>
    )
}

export default Followers
