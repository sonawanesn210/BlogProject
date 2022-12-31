const express= require('express')
const router = express.Router()
const {createAuthor,loginAuthor}=require('../controllers/authorController')
const{createBlog,getBlogs,getBlogsById,deleteBlogById,updateBlogById,updateBlogById1,deleteBlogByQuery}=require('../controllers/blogController')
const {authentication,authorisation}=require('../middlewares/auth')
//------------------------------------------------------//
router.post('/createAuthor',createAuthor)
router.post('/loginAuthor',loginAuthor)

//----------------------------------------------------//
router.post('/createBlog',authentication,createBlog)

router.get('/blogs',authentication,getBlogs)

router.get('/blog/:id',getBlogsById)

router.delete('/delete/:blogId',authentication,authorisation,deleteBlogById)
router.delete('/deleteByQuery',authentication,deleteBlogByQuery)
router.put('/update/:blogId',authentication,authorisation,updateBlogById)
router.put('/update1/:blogId',authentication,authorisation,updateBlogById1)
module.exports=router