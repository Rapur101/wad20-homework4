import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import moment from 'moment'
import Posts from "../../src/components/Posts.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

//Create dummy store
const store = new Vuex.Store({
    state: {
        user: {
            id: 1,
            firstname: 'test',
            lastname: 'test',
            email: 'test',
            avatar: 'test',
        }
    },
    getters: {
        user: (state) => state.user,
    }
});

//Create dummy routes
const routes = [{
        path: '/',
        name: 'posts',
    },
    {
        path: '/profiles',
        name: 'profiles'
    }
];

const router = new VueRouter({ routes });

const testData = [{
        id: 1,
        text: "I think it's going to rain",
        createTime: "2020-12-05 13:53:23",
        likes: 0,
        liked: false,
        media: {
            url: "test-image.jpg",
            type: "image"
        },
        author: {
            id: 2,
            firstname: "Gordon",
            lastname: "Freeman",
            avatar: 'avatar.url'
        }
    },
    {
        id: 2,
        text: "Which weighs more, a pound of feathers or a pound of bricks?",
        createTime: "2020-12-05 13:53:23",
        likes: 1,
        liked: true,
        media: null,
        author: {
            id: 3,
            firstname: "Sarah",
            lastname: "Connor",
            avatar: 'avatar.url'
        }
    },
    {
        id: 4,
        text: null,
        createTime: "2020-12-05 13:53:23",
        likes: 3,
        liked: false,
        media: {
            url: "test-video.mp4",
            type: "video"
        },
        author: {
            id: 5,
            firstname: "Richard",
            lastname: "Stallman",
            avatar: 'avatar.url'
        }
    }
];

//Mock axios.get method that our Component calls in mounted event
jest.mock("axios", () => ({
    get: () => Promise.resolve({
        data: testData
    })
}));

describe('Posts', () => {

    const wrapper = mount(Posts, { router, store, localVue });

    it('1 == 1', function() {
        expect(true).toBe(true)
    });

    it('correct number of posts rendered', function() {
        let posts = wrapper.findAll("div.main-container div.post")
        expect(posts).toHaveLength(testData.length);
    });

    it('correct media type rendered, if exists', function() {
        let posts = wrapper.findAll("div.main-container div.post")

        for (let i = 0; i < testData.length; i++) {
            if (testData[i].media === null) {
                expect(posts.at(i).find("div.post-image").exists()).toBe(false)
            } else if (testData[i].media.type === "image") {
                expect(posts.at(i).find("div.post-image img").exists()).toBe(true)
            } else if (testData[i].media.type === "video") {
                expect(posts.at(i).find("div.post-image video").exists()).toBe(true)
            }
        }
    });


    it('correct post create time rendered', function() {
        let posts = wrapper.findAll("div.main-container div.post")

        for (let i = 0; i < testData.length; i++) {
            const correctTime = moment(testData[i].createTime).format('LLLL');
            expect(posts.at(i).find("span.post-author-info + small").text()).toBe(correctTime);
        }
    });


});