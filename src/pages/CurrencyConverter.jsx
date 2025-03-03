import React, { useState, useEffect } from 'react'
import '../css/currency-converter.css'
import converterApi from '../api/converterApi'
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { LazyLoadImage } from "react-lazy-load-image-component"
import "react-lazy-load-image-component/src/effects/blur.css"

function CurrencyConverter() {

    const [isConverFormDefault, setIsConvertFormDefault] = useState(false)
    const [convertFormError, setConvertFormError] = useState(false)
    const [convertFormSuccess, setConvertFormSuccess] = useState(false)
    const [isConverting, setIsConverting] = useState(false)
    const [fromCurrencySearch, setFromCurrencySearch] = useState("")
    const [toCurrencySearch, setToCurrencySearch] = useState("")

    const [formData, setFormData] = useState({ amount: '', fromCurrency: '', toCurrency: '' })
    const [errors, setErrors] = useState({ amount: '', fromCurrency: '', toCurrency: '', convertForm: '' })
    const [data, setData] = useState({ amount: '', fromCurrency: '', toCurrency: '' })

    const currencies = [
        "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN",
        "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BRL",
        "BSD", "BTN", "BWP", "BYN", "BZD", "CAD", "CDF", "CHF", "CLP", "CNY",
        "COP", "CRC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP",
        "ERN", "ETB", "EUR", "FJD", "FKP", "FOK", "GBP", "GEL", "GGP", "GHS",
        "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF",
        "IDR", "ILS", "IMP", "INR", "IQD", "IRR", "ISK", "JEP", "JMD", "JOD",
        "JPY", "KES", "KGS", "KHR", "KID", "KMF", "KRW", "KWD", "KYD", "KZT",
        "LAK", "LBP", "LKR", "LRD", "LSL", "LYD", "MAD", "MDL", "MGA", "MKD",
        "MMK", "MNT", "MOP", "MRU", "MUR", "MVR", "MWK", "MXN", "MYR", "MZN",
        "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK",
        "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR",
        "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLE", "SLL", "SOS", "SRD",
        "SSP", "STN", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY",
        "TTD", "TVD", "TWD", "TZS", "UAH", "UGX", "USD", "UYU", "UZS", "VES",
        "VND", "VUV", "WST", "XAF", "XCD", "XOF", "XPF", "YER", "ZAR", "ZMW",
        "ZWL"
    ]

    const currencyToCountry = {
        AED: { code: "AE", name: "United Arab Emirates Dirham" },
        AFN: { code: "AF", name: "Afghan Afghani" },
        ALL: { code: "AL", name: "Albanian Lek" },
        AMD: { code: "AM", name: "Armenian Dram" },
        ANG: { code: "CW", name: "Netherlands Antillean Guilder" },
        AOA: { code: "AO", name: "Angolan Kwanza" },
        ARS: { code: "AR", name: "Argentine Peso" },
        AUD: { code: "AU", name: "Australian Dollar" },
        AWG: { code: "AW", name: "Aruban Florin" },
        AZN: { code: "AZ", name: "Azerbaijani Manat" },
        BAM: { code: "BA", name: "Bosnian Convertible Mark" },
        BBD: { code: "BB", name: "Barbadian Dollar" },
        BDT: { code: "BD", name: "Bangladeshi Taka" },
        BGN: { code: "BG", name: "Bulgarian Lev" },
        BHD: { code: "BH", name: "Bahraini Dinar" },
        BIF: { code: "BI", name: "Burundian Franc" },
        BMD: { code: "BM", name: "Bermudian Dollar" },
        BND: { code: "BN", name: "Brunei Dollar" },
        BOB: { code: "BO", name: "Bolivian Boliviano" },
        BRL: { code: "BR", name: "Brazilian Real" },
        BSD: { code: "BS", name: "Bahamian Dollar" },
        BTN: { code: "BT", name: "Bhutanese Ngultrum" },
        BWP: { code: "BW", name: "Botswana Pula" },
        BYN: { code: "BY", name: "Belarusian Ruble" },
        BZD: { code: "BZ", name: "Belize Dollar" },
        CAD: { code: "CA", name: "Canadian Dollar" },
        CDF: { code: "CD", name: "Congolese Franc" },
        CHF: { code: "CH", name: "Swiss Franc" },
        CLP: { code: "CL", name: "Chilean Peso" },
        CNY: { code: "CN", name: "Chinese Yuan" },
        COP: { code: "CO", name: "Colombian Peso" },
        CRC: { code: "CR", name: "Costa Rican Colón" },
        CUP: { code: "CU", name: "Cuban Peso" },
        CVE: { code: "CV", name: "Cape Verdean Escudo" },
        CZK: { code: "CZ", name: "Czech Koruna" },
        DJF: { code: "DJ", name: "Djiboutian Franc" },
        DKK: { code: "DK", name: "Danish Krone" },
        DOP: { code: "DO", name: "Dominican Peso" },
        DZD: { code: "DZ", name: "Algerian Dinar" },
        EGP: { code: "EG", name: "Egyptian Pound" },
        ERN: { code: "ER", name: "Eritrean Nakfa" },
        ETB: { code: "ET", name: "Ethiopian Birr" },
        EUR: { code: "EU", name: "Euro" },
        FJD: { code: "FJ", name: "Fijian Dollar" },
        FKP: { code: "FK", name: "Falkland Islands Pound" },
        FOK: { code: "FO", name: "Faroese Króna" },
        GBP: { code: "GB", name: "British Pound Sterling" },
        GEL: { code: "GE", name: "Georgian Lari" },
        GGP: { code: "GG", name: "Guernsey Pound" },
        GHS: { code: "GH", name: "Ghanaian Cedi" },
        GIP: { code: "GI", name: "Gibraltar Pound" },
        GMD: { code: "GM", name: "Gambian Dalasi" },
        GNF: { code: "GN", name: "Guinean Franc" },
        GTQ: { code: "GT", name: "Guatemalan Quetzal" },
        GYD: { code: "GY", name: "Guyanese Dollar" },
        HKD: { code: "HK", name: "Hong Kong Dollar" },
        HNL: { code: "HN", name: "Honduran Lempira" },
        HRK: { code: "HR", name: "Croatian Kuna" },
        HTG: { code: "HT", name: "Haitian Gourde" },
        HUF: { code: "HU", name: "Hungarian Forint" },
        IDR: { code: "ID", name: "Indonesian Rupiah" },
        ILS: { code: "IL", name: "Israeli New Shekel" },
        IMP: { code: "IM", name: "Isle of Man Pound" },
        INR: { code: "IN", name: "Indian Rupee" },
        IQD: { code: "IQ", name: "Iraqi Dinar" },
        IRR: { code: "IR", name: "Iranian Rial" },
        ISK: { code: "IS", name: "Icelandic Króna" },
        JEP: { code: "JE", name: "Jersey Pound" },
        JMD: { code: "JM", name: "Jamaican Dollar" },
        JOD: { code: "JO", name: "Jordanian Dinar" },
        JPY: { code: "JP", name: "Japanese Yen" },
        KES: { code: "KE", name: "Kenyan Shilling" },
        KGS: { code: "KG", name: "Kyrgyzstani Som" },
        KHR: { code: "KH", name: "Cambodian Riel" },
        KID: { code: "KI", name: "Kiribati Dollar" },
        KMF: { code: "KM", name: "Comorian Franc" },
        KRW: { code: "KR", name: "South Korean Won" },
        KWD: { code: "KW", name: "Kuwaiti Dinar" },
        KYD: { code: "KY", name: "Cayman Islands Dollar" },
        KZT: { code: "KZ", name: "Kazakhstani Tenge" },
        LAK: { code: "LA", name: "Laotian Kip" },
        LBP: { code: "LB", name: "Lebanese Pound" },
        LKR: { code: "LK", name: "Sri Lankan Rupee" },
        LRD: { code: "LR", name: "Liberian Dollar" },
        LSL: { code: "LS", name: "Lesotho Loti" },
        LYD: { code: "LY", name: "Libyan Dinar" },
        MAD: { code: "MA", name: "Moroccan Dirham" },
        MDL: { code: "MD", name: "Moldovan Leu" },
        MGA: { code: "MG", name: "Malagasy Ariary" },
        MKD: { code: "MK", name: "Macedonian Denar" },
        MMK: { code: "MM", name: "Myanmar Kyat" },
        MNT: { code: "MN", name: "Mongolian Tögrög" },
        MOP: { code: "MO", name: "Macanese Pataca" },
        MRU: { code: "MR", name: "Mauritanian Ouguiya" },
        MUR: { code: "MU", name: "Mauritian Rupee" },
        MVR: { code: "MV", name: "Maldivian Rufiyaa" },
        MWK: { code: "MW", name: "Malawian Kwacha" },
        MXN: { code: "MX", name: "Mexican Peso" },
        MYR: { code: "MY", name: "Malaysian Ringgit" },
        MZN: { code: "MZ", name: "Mozambican Metical" },
        NAD: { code: "NA", name: "Namibian Dollar" },
        NGN: { code: "NG", name: "Nigerian Naira" },
        NIO: { code: "NI", name: "Nicaraguan Córdoba" },
        NOK: { code: "NO", name: "Norwegian Krone" },
        NPR: { code: "NP", name: "Nepalese Rupee" },
        NZD: { code: "NZ", name: "New Zealand Dollar" },
        OMR: { code: "OM", name: "Omani Rial" },
        PAB: { code: "PA", name: "Panamanian Balboa" },
        PEN: { code: "PE", name: "Peruvian Sol" },
        PGK: { code: "PG", name: "Papua New Guinean Kina" },
        PHP: { code: "PH", name: "Philippine Peso" },
        PKR: { code: "PK", name: "Pakistani Rupee" },
        PLN: { code: "PL", name: "Polish Złoty" },
        PYG: { code: "PY", name: "Paraguayan Guaraní" },
        QAR: { code: "QA", name: "Qatari Riyal" },
        RON: { code: "RO", name: "Romanian Leu" },
        RSD: { code: "RS", name: "Serbian Dinar" },
        RUB: { code: "RU", name: "Russian Ruble" },
        RWF: { code: "RW", name: "Rwandan Franc" },
        SAR: { code: "SA", name: "Saudi Riyal" },
        SBD: { code: "SB", name: "Solomon Islands Dollar" },
        SCR: { code: "SC", name: "Seychellois Rupee" },
        SDG: { code: "SD", name: "Sudanese Pound" },
        SEK: { code: "SE", name: "Swedish Krona" },
        SGD: { code: "SG", name: "Singapore Dollar" },
        SHP: { code: "SH", name: "Saint Helena Pound" },
        SLE: { code: "SL", name: "Sierra Leonean Leone" },
        SOS: { code: "SO", name: "Somali Shilling" },
        SRD: { code: "SR", name: "Surinamese Dollar" },
        SSP: { code: "SS", name: "South Sudanese Pound" },
        STN: { code: "ST", name: "São Tomé and Príncipe Dobra" },
        SYP: { code: "SY", name: "Syrian Pound" },
        SZL: { code: "SZ", name: "Eswatini Lilangeni" },
        THB: { code: "TH", name: "Thai Baht" },
        TJS: { code: "TJ", name: "Tajikistani Somoni" },
        TMT: { code: "TM", name: "Turkmenistani Manat" },
        TND: { code: "TN", name: "Tunisian Dinar" },
        TOP: { code: "TO", name: "Tongan Paʻanga" },
        TRY: { code: "TR", name: "Turkish Lira" },
        TTD: { code: "TT", name: "Trinidad and Tobago Dollar" },
        TVD: { code: "TV", name: "Tuvalu Dollar" },
        TWD: { code: "TW", name: "New Taiwan Dollar" },
        TZS: { code: "TZ", name: "Tanzanian Shilling" },
        UAH: { code: "UA", name: "Ukrainian Hryvnia" },
        UGX: { code: "UG", name: "Ugandan Shilling" },
        USD: { code: "US", name: "United States Dollar" },
        UYU: { code: "UY", name: "Uruguayan Peso" },
        UZS: { code: "UZ", name: "Uzbekistani Som" },
        VES: { code: "VE", name: "Venezuelan Bolívar Soberano" },
        VND: { code: "VN", name: "Vietnamese Đồng" },
        VUV: { code: "VU", name: "Vanuatu Vatu" },
        WST: { code: "WS", name: "Samoan Tala" },
        XAF: { code: "",  name: "CFA Franc BEAC" },
        XCD: { code: "",  name: "East Caribbean Dollar" },
        XOF: { code: "",  name: "CFA Franc BCEAO" },
        XPF: { code: "",  name: "CFP Franc" },
        YER: { code: "YE", name: "Yemeni Rial" },
        ZAR: { code: "ZA", name: "South African Rand" },
        ZMW: { code: "ZM", name: "Zambian Kwacha" },
        ZWL: { code: "ZW", name: "Zimbabwean Dollar" }
    }
      
    const filteredFromCurrencies = currencies.filter(currency => {
        const searchTerm = fromCurrencySearch.toLowerCase()
        const currencyData = currencyToCountry[currency]
    
        return (
            currency.toLowerCase().includes(searchTerm) ||
            currencyData?.code.toLowerCase().includes(searchTerm) ||
            currencyData?.name.toLowerCase().includes(searchTerm)
        )
    })
    
    const filteredToCurrencies = currencies.filter(currency => {
        const searchTerm = toCurrencySearch.toLowerCase()
        const currencyData = currencyToCountry[currency]
    
        return (
            currency.toLowerCase().includes(searchTerm) || 
            currencyData?.code.toLowerCase().includes(searchTerm) || 
            currencyData?.name.toLowerCase().includes(searchTerm)
        )
    })
    
    const validateAmount = (amount) => {
        if (!amount.trim()) return ''

        if (parseFloat(amount) <= 0) {
            return 'Invalid Amount! Please enter greater than 0.';
        }

        if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
            return 'Invalid Amount! Please select a valid amount.'
        }
        return ''
    }

    const validateFromCurrency = (fromCurrency) => {
        if (!fromCurrency || !fromCurrency.trim() || currencies === fromCurrency ) {
            return 'Invalid Currency. Please select a currency.'
        }
        return ''
    }

    const validateToCurrency = (toCurrency) => {
        if (!toCurrency || !toCurrency.trim() || currencies === toCurrency ) {
            return 'Invalid Currency. Please select a currency.'
        }
        return ''
    }

    const handleConvertInputChange = (field, value) => {

        setIsConvertFormDefault(true)

        if (field === 'amount' && value.startsWith('.')) {
            value = '0' + value;
        }

        setFormData((prev) => ({ ...prev, [field]: value }))

        if (field === 'amount') {
            setErrors((prev) => ({
                ...prev, amount: validateAmount(value)
            }))
        }

        if (field === 'fromCurrency') {
            setErrors((prev) => ({
                ...prev, fromCurrency: validateFromCurrency(value)
            }))
        }

        if (field === 'toCurrency') {
            setErrors((prev) => ({
                ...prev, toCurrency: validateToCurrency(value)
            }))
        }
    }

    useEffect(() => {

        if (!isConverFormDefault || convertFormSuccess) 
        return

        const isConvertFormEmpty =
            !(formData.amount?.trim()) ||
            !(formData.fromCurrency?.trim()) ||
            !(formData.toCurrency?.trim()) 

        const hasConvertErrors =
            errors.amount ||
            errors.fromCurrency ||
            errors.toCurrency


        const convertFormError = isConvertFormEmpty
            ? 'There are empty fields, please adjust them properly.'
            : hasConvertErrors
            ? 'There are incorrect fields, please adjust them properly.'
            : ''

        setErrors((prev) => ({
            ...prev, convertForm: convertFormError
        }))

    }, [formData, isConverFormDefault, convertFormSuccess])

    const handleConvert = async (e) => {
        e.preventDefault()

        const isConvertFormEmpty =
            !(formData.amount?.trim()) ||
            !(formData.fromCurrency?.trim()) ||
            !(formData.toCurrency?.trim()) 

        const hasConvertErrors =
            errors.amount ||
            errors.fromCurrency ||
            errors.toCurrency

        const convertFormError = isConvertFormEmpty
            ? 'There are empty fields, please adjust them properly.'
            : hasConvertErrors
            ? 'There are incorrect fields, please adjust them properly.'
            : ''

        setErrors((prev) => ({ ...prev, convertForm: convertFormError }))
            if (convertFormError) {
            setConvertFormSuccess('')
            return
        }

        if (!convertFormError) {
            setIsConverting(true)

            setConvertFormSuccess('')

            try {
                const cleaned = (str) => str.trim().replace(/\s+/g, ' ')

                const amount = cleaned(formData.amount.trim())
                const fromCurrency = cleaned(formData.fromCurrency.trim())
                const toCurrency = cleaned(formData.toCurrency.trim())

                const { data: result } = await converterApi.post('/convert', {
                    amount: parseFloat(amount),
                    from: fromCurrency,
                    to: toCurrency
                })
            
                if (!result.success || result.error) {
                    setErrors(prev => ({
                        ...prev,
                        convertForm: result.error
                    }))
                    setIsConverting(false)
                    return
                }

                if (result.success) {

                    setConvertFormSuccess(result.message)
                    setData(result.data)

                    setConvertFormError('')

                    setIsConverting(false)
                    setFormData({
                        amount: '',
                        fromCurrency: '',
                        toCurrency: '',
                    })
                }
                
            } 
            catch (error) {
                setErrors((prev) => ({ 
                    ...prev, convertForm: 'An unexpected error occurred. Please try again later.'
                }))
                setConvertFormError('')
                setIsConverting(false)
            }

        }
        
    }

    return (
        <>

        
        
        <form noValidate onSubmit={handleConvert}>
            <div className='currency-converter-card'>
                <div className='currency-converter-card-title'>
                    Currency Converter
                </div>

                <div className='currency-converter-card-content'>
                    
                    <input type='text' placeholder='Enter an Amount' value={formData.amount ?? ''} onChange={(e) => handleConvertInputChange('amount', e.target.value)} />
                    {errors.amount && (<span className="error-amount"><i className='bx bxs-error-circle'></i><p className='error'>{errors.amount}</p></span>)}

                    <div className='currency-label'>

                        <div className='from'>From: {formData.fromCurrency && currencyToCountry[formData.fromCurrency] && (
                            <>
                                <span  key={formData.fromCurrency}>{`${currencyToCountry[formData.fromCurrency].name}`}
                                    <LazyLoadImage
                                    src={`https://flagcdn.com/h240/${currencyToCountry[formData.fromCurrency].code.toLowerCase()}.png`}
                                    alt={`${currencyToCountry[formData.fromCurrency].name} Flag`} loading='lazy'/>
                                </span>
                            </>
                        )}</div>
 
                        <div className='to'>To: {formData.toCurrency && currencyToCountry[formData.toCurrency] && (
                            <>
                                <span  key={formData.toCurrency}>{`${currencyToCountry[formData.toCurrency].name}`}
                                    <LazyLoadImage
                                    src={`https://flagcdn.com/h240/${currencyToCountry[formData.toCurrency].code.toLowerCase()}.png`}
                                    alt={`${currencyToCountry[formData.toCurrency].name} Flag`} loading='lazy'/>
                                </span>
                            </>
                        )}</div>

                    </div>

                    <div className='currency-card-container'>

                        <div className='currency-card-content'>

                            <div className="search-currency">

                                <input type="text" placeholder="Search currency" value={fromCurrencySearch} onChange={(e) => setFromCurrencySearch(e.target.value)} />

                            </div>

                            <Swiper
                                modules={[Navigation, Pagination]}
                                spaceBetween={10}
                                slidesPerView={3}
                                slidesPerGroup={1}
                                grabCursor={true}
                                centeredSlides={true}
                                navigation={{
                                    nextEl: '.from-swiper-button-next',
                                    prevEl: '.from-swiper-button-prev',
                                }}
                                pagination={{
                                    el: '.from-swiper-pagination',
                                    clickable: true,
                                    dynamicBullets: true,
                                }}
                                onSwiper={(swiper) => (window.fromSwiperInstance = swiper)}>

                                {filteredFromCurrencies.map((currency, index) => (
                                    <SwiperSlide key={index}>
                                        <label className="currency-card" onClick={() => window.fromSwiperInstance.slideTo(index)}>
                                            <input type="radio" name="fromCurrency" value={currency} checked={formData.fromCurrency === currency} onChange={(e) => handleConvertInputChange("fromCurrency", e.target.value)} />
                                            <span className="currency-card-value">{currency}</span>
                                        </label>
                                    </SwiperSlide>
                                ))}

                            </Swiper>
                            {errors.fromCurrency && (<span className="error-currency"><i className='bx bxs-error-circle'></i><p className='error'>{errors.fromCurrency}</p></span>)}
                        </div>

                        <div className="swiper-button-next from-swiper-button-next swiper-navBtn"></div>
						<div className="swiper-button-prev from-swiper-button-prev swiper-navBtn"></div>
						<div className="swiper-pagination from-swiper-pagination swiper-navBtn"></div>

                    </div>

                    <div className='currency-card-container'>

                        <div className='currency-card-content'>

                            <div className="search-currency">

                                <input type="text" placeholder="Search currency" value={toCurrencySearch} onChange={(e) => setToCurrencySearch(e.target.value)} />

                            </div>

                            <Swiper
                                modules={[Navigation, Pagination]}
                                spaceBetween={10}
                                slidesPerView={3}
                                slidesPerGroup={1}
                                grabCursor={true}
                                centeredSlides={true}
                                navigation={{
                                    nextEl: '.to-swiper-button-next',
                                    prevEl: '.to-swiper-button-prev',
                                }}
                                pagination={{
                                    el: '.to-swiper-pagination',
                                    clickable: true,
                                    dynamicBullets: true,
                                }}
                                onSwiper={(swiper) => (window.toSwiperInstance = swiper)}>

                                {filteredToCurrencies.map((currency, index) => (
                                    <SwiperSlide key={index}>
                                        <label className="currency-card" onClick={() => window.toSwiperInstance.slideTo(index)}>
                                            <input type="radio" name="toCurrency"  value={currency} checked={formData.toCurrency === currency} onChange={(e) => handleConvertInputChange("toCurrency", e.target.value)}  />
                                            <span className="currency-card-value">{currency}</span>
                                        </label>
                                    </SwiperSlide>
                                ))}

                            </Swiper>
                            {errors.toCurrency && (<span className="error-currency"><i className='bx bxs-error-circle'></i><p className='error'>{errors.toCurrency}</p></span>)}
                        </div>

                        <div className="swiper-button-next to-swiper-button-next swiper-navBtn"></div>
						<div className="swiper-button-prev to-swiper-button-prev swiper-navBtn"></div>
						<div className="swiper-pagination to-swiper-pagination swiper-navBtn"></div>

                    </div>

                </div>
                
                {data && data.conversion > 0 ? (
                <div className='data'>
                    <span className='data-conversion'>{Number(data.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {data.from} = {Number(data.conversion).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {data.to}</span>
                    <span className='data-rate'>1.00 {currencyToCountry[data.from]?.name} = {data.rate} {currencyToCountry[data.to]?.name}</span>
                </div>) : (
                    <div className='data'>
                    </div>
                )}

                {convertFormSuccess && <span className="empty-error-message"><i className="bx bxs-check-circle"></i><p className="blue">{convertFormSuccess}</p></span>}
				{errors.convertForm && (<span className="empty-error-message"><i className="bx bxs-error-circle"></i><p className="red">{errors.convertForm}</p></span>)}

                <button type='submit' className='convert-button'>{isConverting ? (<span className="animated-dots">Converting<span className="dots"></span></span>) : ('Convert')}</button>

            </div>

        </form>
            
        </>
    )
}

export default CurrencyConverter