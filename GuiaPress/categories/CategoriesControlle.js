const router = require('express').Router()
const Category = require('./Category')
const slugify = require('slugify')

router.get('/admin/categories/new', (req, res) => {
    res.render('admin/categories/new.ejs')
})

router.post('/categories/save', async(req, res)=> {
    const {title} = req.body

    if(title != undefined){

        await Category.create({
            title: title, 
            slug:slugify(title)
        }).then(()=> {
            res.redirect('/admin/categories')
        })

    }else{
        res.redirect('/admin/categories/new')
    }
})

router.get('/admin/categories', async(req, res) => {
    
    await Category.findAll().then(categories => {
        console.log('Cheguei aqui')
        res.render('admin/categories/index', {categories: categories})
    })
  
  
})

router.post('/categories/delete', (req, res) => {
    const id = req.body.id
   
    if(id != undefined){
        if(!isNaN(id)){

            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admin/categories') 
            })

        }else{
           res.redirect('/admin/categories') 
        }
    }else{
        res.redirect('/admin/categories') 

    }
})

router.get('/admin/categories/edit/:id', (req, res) => {
    const {id} = req.params
  
    if(isNaN(id)){
        res.redirect('/admin/categories')
    }
    
    Category.findByPk(id).then(category => {
        if(category != undefined){
            res.render('admin/categories/edit', {category: category})
        }else{
            res.redirect('/admin/categories')
        }
    }).catch((err) => res.redirect('/admin/categories') )
})

router.post('/categories/update', (req, res)=> {
    const {id, title} = req.body

    Category.update({title: title, slug: slugify(title)}, {where: {id: id}}).then(()=> {
        res.redirect('/admin/categories')
    })
})
module.exports = router