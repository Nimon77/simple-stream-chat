export default function handler(req, res) {
    res.redirect(307, process.env.STREAM_URL)
}