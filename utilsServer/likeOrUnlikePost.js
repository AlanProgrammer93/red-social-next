const UserModel = require('../models/UserModel');
const PostModel = require('../models/PostModel');
const {
    newLikeNotification,
    removeLikeNotification
} = require('../utilsServer/notificationActions');

const likeOrUnlikePost = async (postId, userId, like) => {
    try {
        const post = await PostModel.findById(postId);

        if (!post) return {error: "Post no encontrado"}

        if (like) {
            const isLiked = post.likes.filter(like => like.user.toString() === userId).length > 0;

            if (isLiked) return {error: "Este post ya te gusta"}

            await post.likes.unshift({user: userId});

            await post.save();

            if (post.user.toString() !== userId) {
                await newLikeNotification(userId, postId, post.user.toString());
            }
        } else {
            const isLiked = post.likes.filter(like => like.user.toString() === userId).length === 0;

            if (isLiked) return {error: "No pusiste me gusta a este post anteriormente"}
            
            const indexOf = post.likes.map(like => like.user.toString()).indexOf(userId);

            await post.likes.splice(indexOf, 1);

            await post.save();

            if (post.user.toString() !== userId) {
                await removeLikeNotification(userId, postId, post.user.toString());
            }
        }

        const user = await UserModel.findById(userId);
        const {name, profilePicUrl, username} = user;

        return {
            success: true, 
            name, 
            profilePicUrl, 
            username,
            postByUserId: post.user.toString()
        };
    } catch (error) {
        return {error: "Error en el servidor"}
    }
}

module.exports = {likeOrUnlikePost};
