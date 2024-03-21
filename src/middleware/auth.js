function checkRole(rol,rol2) {
  return (req, res, next) => {
    if (req.session.rol === rol || req.session.rol === rol2) {
        next()
    } else {
        res.status(403).render('access-restricted', { message: "Acceso Restringido"});
    }
  };
}

module.exports = checkRole;
