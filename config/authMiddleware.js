module.exports = {

isContributor: (req, res, next) => {
    if(!req.user || (req.user.status !== "contributor" && req.user.status !== "admin")){
        return res.json("You are not authorized to perform that action.")
    }
    next();
    
  },
  
isAdmin: (req, res, next) => {
    if(!req.user || !req.user.status === "admin"){
        // return res.redirect('/login');
        return res.json("You are not authorized to perform that action.")
    }
    next();
  }

}