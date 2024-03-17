function checkRole(rol) {
  return (req, res, next) => {
    if (req.session.rol === rol) {
        next()
    } else {
        res.status(403).render('access-restricted', { message: "Acceso Restringuido"});
    }
  };
}

module.exports = checkRole;
