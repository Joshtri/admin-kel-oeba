
export const dashboardPage = async(req,res)=>{
    const title = "Dashboard";
    try {
        

        const user = req.session.user;
        res.render('dashboard',{
            title,
            user

        });
    } catch (error) {
        console.log(error);
    }


}


export const informasiAkunPage = (req,res)=>{
    const title = "Informasi Akun";
    try {
        const user = req.session.user;

        console.log(user);

        res.render('informasi_akun',{
            title,
            user
        });
    } catch (error) {
        console.log(error);
    }
};


export const logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Failed to log out.' });
        }
        res.redirect('/');
    });
};