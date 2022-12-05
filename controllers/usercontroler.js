const getUserhome = (req, res) => {
    res.render('user/userHome')
}
const getUserlogin = (req, res) => {
    res.render('user/UserLogin')
}
module.exports={getUserlogin,
                getUserhome}    