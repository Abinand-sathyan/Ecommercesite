const getUserhome = (req, res) => {
    res.render('user/userHome')
}
const getUserlogin = (req, res) => {
    res.render('user/UserLogin')
}
const getUserSignUp = (req, res) => {
    res.render('user/userSignUp')
}
module.exports={getUserlogin,
                getUserhome,
                getUserSignUp}    