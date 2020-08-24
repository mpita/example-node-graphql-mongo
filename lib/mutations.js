'use strict'

const connectDb = require('./db');
const { ObjectID, Cursor } = require('mongodb');
const errorHandler = require('./errorHandler')

module.exports = {
    createCourse: async (root, { input }) => {
        const defaults = {
            teacher: '',
            topic: ''
        };

        const newCourse = Object.assign(defaults, input);
        let db;
        let course;

        try {
            db = await connectDb()
            course = await db.collection('courses').insertOne(newCourse);
            newCourse._id = course.insertedId
        } catch (error) {
            errorHander(error)
        }

        return newCourse
    },
    createPerson: async (root, { input }) => {

        let db;
        let student;

        try {
            db = await connectDb()
            student = await db.collection('students').insertOne(input);
            input._id = student.insertedId
        } catch (error) {
            errorHander(error)
        }

        return input
    },
    editCourse: async (root, {_id, input}) => {
        let db;
        let course;

        try {
            db = await connectDb()
            await db.collection('courses').updateOne(
                { _id: ObjectID(_id) },
                { $set: input }
            );
            course = await db.collection('courses').findOne({ _id: ObjectID(_id) })
        } catch (error) {
            errorHander(error)
        }

        return course
    },
    editPerson: async (root, {_id, input}) => {
        let db;
        let student;

        try {
            db = await connectDb()
            await db.collection('students').updateOne(
                { _id: ObjectID(_id) },
                { $set: input }
            );
            student = await db.collection('students').findOne({ _id: ObjectID(_id) })
        } catch (error) {
            errorHander(error)
        }

        return student
    },
    addPeople: async (root, {courseID, personID}) => {
        let db
        let course
        let person

        try {
            db = await connectDb()
            course = await db.collection('courses').findOne({ _id: ObjectID(courseID) })
            person = await db.collection('students').findOne({ _id: ObjectID(personID) })

            if (!course || !person) throw new Error('La persona o el curso no existe')

            await db.collection('courses').updateOne(
                { _id: ObjectID(courseID) },
                { $addToSet: { people: ObjectID(personID) } }
            )
        } catch (error) {
            errorHander(error)
        }

        return course
    }
}