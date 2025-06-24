require('dotenv').config()
const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../api/index')

beforeEach(async () => {
    await mongoose.connect(process.env.MONGODB_URL)
})

afterEach(async () => {
    await mongoose.connection.close()
})

describe('resource /sign-up', () => {
    it('should be return success sign-up', async () => {
        const response = await request(app)
            .post("/sign-up")
            .set("Content-Type", "application/json")
            .send({
                email: "user@gmail.com",
                password: "pass1234"
            })
        expect(response.statusCode).toBe(201)
        expect(response.body.message).toBe("Sign-Up Success")
    });

    it('should be return email is available', async () => {
        const response = await request(app)
            .post("/sign-up")
            .set("Content-Type", "application/json")
            .send({
                email: "user@gmail.com",
                password: "pass1234"
            })
        expect(response.statusCode).toBe(401)
        expect(response.body.message).toBe("Email is Available!")
    })
});

describe('resource /sign-in', () => {
    it('should be success sign-in', async () => {
        const response = await request(app)
            .post("/sign-in")
            .set("Content-Type", "application/json")
            .send({
                email: "user@gmail.com",
                password: "pass1234",
                token: "token123"
            })
        expect(response.statusCode).toBe(201)
        expect(response.body.message).toBe("Sign-In Success")
    })

    it('should be email not found', async () => {
        const response = await request(app)
            .post('/sign-in')
            .set('Content-Type', 'application/json')
            .send({
                email: "user1@gmail.com",
                password: "pass1234",
                token: "token123"
            })
        expect(response.statusCode).toBe(404)
        expect(response.body.message).toBe("Email Not Found!")
    })
})

describe('resource /my-movies', () => {
    it('should be success adding favorite movies', async () => {
        const response = await request(app)
            .post('/my-movies')
            .set('Content-Type', 'application/json')
            .send({
                email: "user@gmail.com",
                token: "token123",
                data: {
                    id: 1,
                    title: "testing",
                    description: "testing desc"
                }
            })
        expect(response.statusCode).toBe(201)
        expect(response.body.message).toBe("Adding Favorite Movie Success")
    })

    it('should be movie id is available', async () => {
        const response = await request(app)
            .post('/my-movies')
            .set('Content-Type', 'application/json')
            .send({
                email: "user@gmail.com",
                token: "token123",
                data: {
                    id: 1,
                    title: "testing",
                    description: "testing desc"
                }
            })
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe("Movie Id is Available!")
    })

    it('should be getting favorite movie success', async () => {
        const response = await request(app).get('/my-movies/user@gmail.com/token123')

        expect(response.statusCode).toBe(200)
        expect(response.body.message).toBe("Getting Favorite Movie Success")
    })

    it('should be error unauthorized message', async () => {
        const response = await request(app).get("/my-movies/user@gmail.com/token1234")

        expect(response.statusCode).toBe(401)
        expect(response.body.message).toBe("Email Or Token Not Available!")
    })

    it('should be success removing movies', async () => {
        const response = await request(app)
            .delete('/my-movies')
            .set('Content-Type', 'application/json')
            .send({
                email: "user@gmail.com",
                token: "token123",
                movieID: 1
            })
        expect(response.statusCode).toBe(204)
        expect(response.body.message).toBe("Removing Movie Success")
    })

    it('should be movie id not found', async () => {
        const response = await request(app)
            .delete('/my-movies')
            .set('Content-Type', 'application/json')
            .send({
                email: "user@gmail.com",
                token: "token123",
                movieID: 1
            })
        expect(response.statusCode).toBe(404)
        expect(response.body.message).toBe("Movie Id Not Found!")
    })
})

describe('resource /sign-out', () => {
    it('should be sign-out success', async () => {
        const response = await request(app)
            .delete('/sign-out')
            .set('Content-Type', 'application/json')
            .send({
                email: "user@gmail.com",
                token: "token123"
            })
        expect(response.statusCode).toBe(204)
        expect(response.body.message).toBe("Sign-Out Success")
    })

    it('should be error unauthorized message', async () => {
        const response = await request(app)
            .delete('/sign-out')
            .set('Content-Type', 'application/json')
            .send({
                email: "user@gmail.com",
                token: "token1234"
            })
        expect(response.statusCode).toBe(401)
        expect(response.body.message).toBe("Email Or Token Not Available!")
    })
})