import axios from 'axios'

export const convert = async (req, res) => {
    const { amount, from, to } = req.body

    if (!amount || !from || !to) {
        return res.status(400).json({
            error: 'Missing required fields',
            success: false
        })
    }

    try {
        
        const apiKey = process.env.CURRENCY_API_KEY
        const url = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&base_currency=${from}`

        const { data } = await axios.get(url)

        if (!data || !data.data || !data.data[to]) {
            return res.status(400).json({
                error: 'Conversion failed. Please try again.',
                success: false
            })
        }

        const rate = data.data[to].value
        const conversion = (amount * rate).toFixed(2)

        return res.status(200).json({
            success: true,
            message: 'Currency conversion has been successful.',
            data: {
                from,
                to,
                amount,
                conversion,
                rate
            }
        })

    } catch (error) {
        return res.status(500).json({
            error: 'An unexpected error occurred. Please try again later.'
        })
    }
}