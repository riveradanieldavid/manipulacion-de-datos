const db = require('../database/models');
const sequelize = db.sequelize;

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', { movies })
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', { movie });
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order: [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', { movies });
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: { [db.Sequelize.Op.gte]: 8 }
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', { movies });
            });
    },
    
    //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: (req, res) => {
        db.Genre.findAll()
            .then((genres) => {
                return res.render('moviesAdd', {
                    allGenres: genres
                });
            })
            .catch(error => console.log(error))
    },

    create: (req, res) => {
        // CREAR PRODUCTO CON ESTOS DATOS QUE VIENEN DEL FORM
        db.Movie.create({
            title: req.body.title.trim(),
            rating: req.body.rating,
            awards: req.body.awards,
            release_date: req.body.release_date,
            length: req.body.length,
        })
            // LUEGO CUANDO LO ANTERIOR TERMINE...
            .then((result) => {
                // FINALMENTE REDIRIGIR
                // return res.send(req.body);//COMPROBAR
                return res.redirect('/movies');
            })
            .catch(error => console.log(error))
    }, //STORE /

    edit: (req, res) => {
        let peliEditar = db.Movie.findByPk(req.params.id, { //PARA EDITAR, ELIMINAR findBtPk()
            include: [{ all: true }] // SI NO ESTA ESTO NO SE PUEDE EDITAR
        })
        let generos = db.Genre.findAll({
            include: [{ all: true }]
        })
        Promise.all([generos, peliEditar])
            .then(([generos, peliEditar]) => {
                // return res.send(peliEditar)
                return res.render('MoviesEdit', {
                    allGenres: generos,
                    Movie: peliEditar
                });
            })
            .catch(error => console.log(error))
    },

    update: (req, res) => {
        // CREAR PRODUCTO CON ESTOS DATOS QUE VIENEN DEL FORM
        db.Movie.update({
            title: req.body.title.trim(),
            rating: req.body.rating,
            awards: req.body.awards,
            release_date: req.body.release_date,
            length: req.body.length,
            genre_id: req.body.genre_id
        },
            {
                where: {
                    id: req.params.id
                }
            })
            // LUEGO CUANDO LO ANTERIOR TERMINE...
            .then((result) => {
                // FINALMENTE REDIRIGIR
                // return res.send(req.body);//COMPROBAR
                return res.redirect('/movies/detail/' + req.params.id);
            })
            .catch(error => console.log(error))

    },

    //ELIMINAR PRODUCTO DELETE DESTROY
    delete: (req, res) => {
        db.Movie.findByPk(req.params.id, { //PARA EDITAR, ELIMINAR findBtPk()
            include: [{ all: true }] // SI NO ESTA ESTO NO SE PUEDE EDITAR
        })
            .then((Movie) => {
                return res.render('moviesDelete', {
                    Movie,
                });
            })
            .catch(error => console.log(error))
    },

    destroy: (req, res) => {
        db.Movie.destroy({
            where: {
                id: req.params.id,
            }
        })
            .then((Movie) => {
                return res.redirect('/movies')
            })
            .catch(error => console.log(error))
    },






}

module.exports = moviesController;