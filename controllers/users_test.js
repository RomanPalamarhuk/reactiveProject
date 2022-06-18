export const getTest = (req, res) => {
    console.log(req.params.id);
    res.status(200).json({user : req.params.id});
}
