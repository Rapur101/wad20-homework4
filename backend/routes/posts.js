const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const PostModel = require('../models/PostModel');


router.get('/', authorize, (request, response) => {

    // Endpoint to get posts of people that currently logged in user follows or their own posts

    PostModel.getAllForUser(request.currentUser.id, (postIds) => {

        if (postIds.length) {
            PostModel.getByIds(postIds, request.currentUser.id, (posts) => {
                response.status(201).json(posts)
            });
            return;
        }
        response.json([])

    })

});

router.post('/', authorize,  (request, response) => {

    // Endpoint to create a new post
    let text = request.body.text;
    let media = request.body.media;

    let form = {
        text: {required: false},
        media: {required: false},
    };

    let urlType = checkURL(media.url)

    for (let field in form) {
        if (!media.type) {
            if (media.url) {
                return;
            } else {
                if (!text) {
                    return;
                }
            }
        } else {
            if (!urlType) {
                return;
            } else if (media.type !== urlType) return;
        }
    }

    let params = {
        userId: request.currentUser.id,
        text: request.body.text,
        media: request.body.media
    };

    PostModel.create(params, () => {
        response.status(201).json()
    });

});


router.put('/:postId/likes', authorize, (request, response) => {
    // Endpoint for current user to like a post
    let userId = request.currentUser.id;
    let postId = request.params.postId;
    console.log(userId)
    console.log(postId)

    PostModel.like(userId, postId , () => {
        response.status(200).json()
    })
});

router.delete('/:postId/likes', authorize, (request, response) => {
    // Endpoint for current user to unlike a post
    let userId = request.currentUser.id;
    let postId = request.params.postId;
    console.log(userId)
    console.log(postId)
    PostModel.unlike(userId, postId, () => {
        response.status(200).json()
    })
});

function checkURL(url) {
    if (!url) {
        return null
    } else if (url.match(/\.(jpeg|jpg|gif|png)$/) != null) {
        return "image";
    } else if (url.match(/\.(mov|mp4|avi|webm|mpeg-4|wmv|flv|mkv)$/) != null) {
        return "video"
    } else {
        return null
    }
}

module.exports = router;
