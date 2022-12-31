const authorModel = require('../models/authorModel')
const blogModel = require('../models/blogModel')
const validate = require('../validators/validations')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
//---------------------------------------------//

const createBlog = async (req, res) => {
    try {
        let data = req.body
        if (!validate.isValidBody(data)) {
            return res.status(400).send({ status: false, message: "Please Enter data" })
        }

        let { title, body, authorId, tags, category, subCategory, isDeleted, deletedAt, isPublished, publishedAt } = data

        if (!title) {
            return res.status(400).send({ status: false, message: "please enter title" })
        }

        if (!validate.isValidString(title)) {
            return res.status(400).send({ status: false, message: "Enter valid title" })
        }

        if (!body) {
            return res.status(400).send({ status: false, message: "please enter body" })
        }

        if (!validate.isValidString(body)) {
            return res.status(400).send({ status: false, message: "Enter valid body" })
        }

        if (!authorId) {
            return res.status(400).send({ status: false, message: "please enter authorId" })
        }

        if (!validate.isValidObjectId(authorId)) {
            return res.status(400).send({ status: false, message: "Please enter valid  authorId" })
        }

        let findAuthor = await authorModel.findById(authorId)

        if (!findAuthor) {
            return res.status(404).send({ status: false, message: `${data.authorId} is not found` })
        }
        if (tags) {
            for (let i = 0; i < tags.length; i++) {
                if (!validate.isValidString(tags[i])) {
                    return res.status(400).send({ status: false, message: "enter valid tags" })
                }
            }
        }

        if (!category) {
            return res.status(400).send({ status: false, message: "Please Enter category" })
        }
        if (category) {
            for (let i = 0; i < category.length; i++) {
                if (!validate.isValidString(category[i])) {
                    return res.status(400).send({ status: false, message: "Enter valid category" })
                }
            }
        }
        if (subCategory) {
            for (let i = 0; i < subCategory.length; i++) {
                if (!validate.isValidString(subCategory[i])) {
                    return res.status(400).send({ status: false, message: "Enter valid subCategory" })
                }
            }
        }
        if (isDeleted) {
            if (typeof isDeleted != 'boolean') {
                return res.status(400).send({ status: false, message: "isDeleted must be boolean" })
            }
            if (isDeleted === true) {
                return res.status(400).send({ status: false, message: "isDeleted must be false while creating blog" })
            }
        }
        if (isPublished) {
            if (typeof isPublished != 'boolean') {
                return res.status(400).send({ status: false, message: "isPublished must be boolean" })
            }

        }

        if (isPublished == true) {
            data.publishedAt = new Date()
        }

        let token = req.headers['x-api-key'] || req.headers['x-Api-Key']
        /* if(!token){
            return res.status(400).send({status:false,message:"Please provide token"})
        } */

        let decodedToken = jwt.verify(token, 'BlogProject')
        if (decodedToken.userId != authorId) {
            return res.status(401).send({ status: false, message: "You are Not Authorized To create This Book With This userId" })
        }

        let createBlogData = await blogModel.create(data)
        return res.status(201).send({ status: true, message: "Blog created successfully", data: createBlogData })

    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}

//------------------------------------------------//


const getBlogs = async (req, res) => {

    try {

        const authorId = req.query.authorId
        const category = req.query.category;
        const tags = req.query.tags;
        const subCategory = req.query.subCategory;
        let page = req.query.page;
        let pageSize = req.query.pageSize;

        const filter = {
            isDeleted: false
        }
        if (authorId)
            filter.authorId = authorId

        if (filter.authorId) {
            if (!validate.isValidObjectId(filter.authorId)) {
                return res.status(400).send({ status: false, message: "Please enter valid authorId" })
            }


            let findAuthorId = await authorModel.findById(filter.authorId)

            if (!findAuthorId) {
                return res.status(404).send({ status: false, message: "AuthorId not found" })

            }
        }

        if (category) {
            filter.category = category
        }

        if (tags) {
            filter.tags = tags
        }

        if (filter.tags) {
        }


        if (subCategory) {
            filter.subCategory = subCategory
        }

        if (page) {
            parseInt(page)
        } else {
            page = 0
        }
        if (pageSize) {
            parseInt(pageSize)
        } else {
            pageSize = 0
        }
        let blogData = await blogModel.find(filter).sort({ title: 1 }).limit(pageSize).skip(pageSize * page)

        if (blogData.length === 0) {
            return res.status(404).send({ status: false, message: "Blog not found" })
        }

        return res.status(200).send({ status: true, count: blogData.length, BlogList: blogData })

    }
    catch (error) {
        return res.status(500).send({ status: false, Error: error.message })
    }
}

//---------------------------------------------------------------------------------------//

const getBlogsById = async (req, res) => {
    try {

        const id = req.params.id
        if (id) {

            if (!validate.isValidObjectId(id)) {
                return res.status(400).send({ status: false, message: "blogId is Not Valid" });
            }
        }

        const blogDetails = await blogModel.find({ _id: id, isDeleted: false })
        if (blogDetails.length == 0) {
            return res.status(404).send({ status: false, message: "No blog found this id" })
        }

        if (blogDetails.isDeleted == true) {
            return res.status(404).send({ status: false, message: "This todo is already Deleted" })
        }
        return res.status(200).send({ status: false, blogList: blogDetails })

    }
    catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
}

//--------------------------------------------//
const updateBlogById = async (req, res) => {
    try {
        const id = req.params.blogId;

        if (id) {
            if (!validate.isValidObjectId(id)) {
                return res.status(400).send({ status: false, message: "Provide valid id" })
            }
        }

        const blogDetails = await blogModel.findOne({ _id: id, isDeleted: false })

        if (!blogDetails) {
            return res.status(404).send({ status: false, message: "Blog not found" })
        }

        if (!req.body.title && !req.body.body && !req.body.tags && !req.body.subCategory && !req.body.isPublished && !req.body.publishedAt) {
            return res.status(400).send({ status: false, message: "Please provide apropriate data to update" })
        }

        if (req.body.title) {
            blogDetails.title = req.body.title
        }

        if (!validate.isValidString(blogDetails.title)) {
            return res.status(400).send({ status: false, message: "Enter valid title" })
        }
        if (req.body.body) {
            blogDetails.body = req.body.body
        }
        if (!validate.isValidString(blogDetails.body)) {
            return res.status(400).send({ status: false, message: "Enter valid body" })
        }
        if (req.body.tags) {
            blogDetails.tags = req.body.tags

        }

        if (blogDetails.tags) {
            for (let i = 0; i < blogDetails.tags.length; i++) {
                if (!validate.isValidString(blogDetails.tags[i])) {
                    return res.status(400).send({ status: false, message: "enter valid tags" })
                }
            }
        }
        if (req.body.subCategory) {
            blogDetails.subCategory = req.body.subCategory

        }
        if (blogDetails.subCategory) {
            for (let i = 0; i < blogDetails.subCategory.length; i++) {
                if (!validate.isValidString(blogDetails.subCategory[i])) {
                    return res.status(400).send({ status: false, message: "enter valid subCategory" })
                }
            }
        }
        if (req.body.isPublished == true) {
            blogDetails.publishedAt = new Date();
            blogDetails.isPublished = true
        }
        blogDetails.save()
        return res.status(200).send({ status: false, message: "updated successfully", data: blogDetails })
    }
    catch (error) {
        res.status(500).send({ status: false, error: error })
    }
}

//---------------------------------------------------//

//by using findoneAndUpdate Method
const updateBlogById1 = async (req, res) => {
    try {
        const id = req.params.blogId;

        if (id) {
            if (!validate.isValidObjectId(id)) {
                return res.status(400).send({ status: false, message: "Provide valid id" })
            }
        }

        const blogDetails = await blogModel.findOne({ _id: id, isDeleted: false })

        if (!blogDetails) {
            return res.status(404).send({ status: false, message: "Blog not found" })
        }

        if (!req.body.title && !req.body.body && !req.body.tags && !req.body.subCategory && !req.body.isPublished && !req.body.publishedAt) {
            return res.status(400).send({ status: false, message: "Please provide apropriate data to update" })
        }

        if (req.body.title) {
            if (!validate.isValidString(blogDetails.title)) {
                return res.status(400).send({ status: false, message: "Enter valid title" })
            }
        }


        if (req.body.body) {
            if (!validate.isValidString(blogDetails.body)) {
                return res.status(400).send({ status: false, message: "Enter valid body" })
            }
        }

        if (req.body.isPublished == true) {
            publishedAt = new Date()
        }


        if (req.body.tags) {

            for (let i = 0; i < req.body.tags.length; i++) {
                if (!validate.isValidString(req.body.tags[i])) {
                    return res.status(400).send({ status: false, message: "enter valid tags" })
                }

            }
        }


        if (req.body.subCategory) {


            for (let i = 0; i < req.body.subCategory.length; i++) {
                if (!validate.isValidString(req.body.subCategory[i])) {
                    return res.status(400).send({ status: false, message: "enter valid subCategory" })
                }

            }
        }



        let updateBlog = await blogModel.findOneAndUpdate({ _id: id }, { tags: req.body.tags, subCategory: req.body.subCategory, title: req.body.title, body: req.body.body, isPublished: req.body.isPublished }, { new: true })

        if (updateBlog.isPublished == true) {
            let updateData = await blogModel.findOneAndUpdate({ _id: id }, { publishedAt: new Date() }, { new: true })
            return res.status(200).send({ status: true, message: "updated successfully", data: updateData })
        }
        res.status(200).send({ status: true, message: "updated successfully", data: updateBlog })
    }

    catch (error) {
        res.status(500).send({ status: false, error: error })
    }
}




//-----------------------------------------------------------------------------------------------------------//


const deleteBlogById = async (req, res) => {
    try {
        const id = req.params.blogId;

        if (!validate.isValidObjectId(id)) {
            return res.status(400).send({ status: false, message: "id is not valid " })
        }

        let findBlog = await blogModel.findOne({ _id: id })
        if (!findBlog) {
            return res.status(404).send({ status: false, message: "Blog with this ID is not found" })
        }
        if (findBlog.isDeleted == true) {
            return res.status(404).send({ status: false, message: "May be this blog deleted already" })

        }
        await blogModel.findOneAndUpdate({ _id: id, isDeleted: false }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
        return res.status(200).send({ status: true, message: "Blog deleted successfully" })

        /*   await blogModel.findOneAndDelete({_id:id,isDeleted:false},{$set:{deletedAt:new Date()}},)
          return res.status(200).send({status:true,message:"Blog deleted successfully"}) */
    }
    catch (error) {
        res.status(500).send({ status: false, error: error })
    }

}


//-------------------------------------//
const deleteBlogByQuery = async (req, res) => {
    try {
        let token = req.headers['x-api-key'] || req.headers['x-Api-Key']




        let data = req.query
        let { category, authorId, tags, subCategory } = data


        if (!validate.isValidBody(data)) {
            return res.status(400).send({ status: false, message: "Provide some data " })
        }
        if (!category && !authorId && !tags && !subCategory) {
            return res.status(400).send({ status: false, message: "Provide appropriate query params " })
        }

        if (authorId) {
            let decodedToken = jwt.verify(token, 'BlogProject')
            if (decodedToken.userId != authorId) {
                return res.status(401).send({ status: false, message: "You are Not Authorized To create This Book With This userId" })
            }
        }
        let findBlog = await blogModel.find({ isDeleted: false })
        if (findBlog.length === 0) {
            return res.status(404).send({ status: false, message: "May be this blog deleted already" })
        }

        let deletedBlogs = await blogModel.updateMany(
            data,
            { isDeleted: true, isPublished: false, deletedAt: new Date() },
        );

        res.status(200).send({ status: true, msg: `${deletedBlogs.modifiedCount} blogs has been deleted` });


    }
    catch (error) {
        res.status(500).send({ status: false, error: error })
    }
}




//---------------------------------------//
module.exports = { createBlog, getBlogs, getBlogsById, deleteBlogById, updateBlogById, updateBlogById1, deleteBlogByQuery }