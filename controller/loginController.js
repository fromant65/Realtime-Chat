function loginPost(req,res){
    let session = req.session;
    if (req.body.username) {
      session.userid = req.body.username;
      const room = req.body.room || "default";
      res.redirect(`/index/${room}`);
    }
}

module.exports = loginPost;