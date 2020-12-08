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

    const fieldMissing = {
        code: null,
        message: 'Please provide %s field'
    };

    for (let field in form) {
        if (!media.type) {
            if (media.url) {
                fieldMissing.code = field;
                fieldMissing.message = fieldMissing.message.replace('%s', field);
                return;
            } else {
                if (!text) {
                    return;
                }
            }
        } else {
            if (!media.url) {
                fieldMissing.code = field;
                fieldMissing.message = fieldMissing.message.replace('%s', field);
                return;
            }
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

module.exports = router;
