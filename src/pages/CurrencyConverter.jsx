import React, { useState, useEffect } from 'react'
import '../css/currency-converter.css'
import converterApi from '../api/converterApi'
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

function CurrencyConverter() {

    const [isConverFormDefault, setIsConvertFormDefault] = useState(false)
    const [convertFormError, setConvertFormError] = useState(false)
    const [convertFormSuccess, setConvertFormSuccess] = useState(false)
    const [isConverting, setIsConverting] = useState(false)

    const [formData, setFormData] = useState({ amount: '', fromCurrency: '', toCurrency: '' })
    const [errors, setErrors] = useState({ amount: '', fromCurrency: '', toCurrency: '', convertForm: '' })

    const validateAmount = (amount) => {
        if (!amount.trim()) return ''

        if (!/^\d+$/.test(amount)) {
            return 'Invalid Amount! Please use a valid amount.'
        }
        return ''
    }

    const handleConvertInputChange = (field, value) => {

        setIsConvertFormDefault(true)

        setFormData((prev) => ({ ...prev, [field]: value }))

        if (field === 'amount') {
            setErrors((prev) => ({
                ...prev, amount: validateAmount(value)
            }))
        }
    }

    useEffect(() => {

        if (!isConverFormDefault || convertFormSuccess) 
        return

        const isConvertFormEmpty =
            !(formData.amount?.trim())

        const hasConvertErrors =
            errors.amount
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
        const isConvertFormEmpty =
            !(formData.amount?.trim())

        const hasConvertErrors =
            errors.amount
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
                        <div className='from'>From</div>
                        <div className='to'>To</div>
                    </div>

                    <div className='currency-card-container'>

                        <div className='currency-card-content'>

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

                                {["USD", "EUR", "GBP", "JPY", "AUD"].map((toCurrency, index) => (
                                    <SwiperSlide key={index}>
                                        <label className="currency-card" onClick={() => window.fromSwiperInstance.slideTo(index)}>
                                            <input type="radio" name="fromCurrency" value={toCurrency} />
                                            <span className="currency-card-value">{toCurrency}</span>
                                        </label>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                        </div>

                        <div className="swiper-button-next from-swiper-button-next swiper-navBtn"></div>
						<div className="swiper-button-prev from-swiper-button-prev swiper-navBtn"></div>
						<div className="swiper-pagination from-swiper-pagination swiper-navBtn"></div>

                    </div>

                    <div className='currency-card-container'>

                        <div className='currency-card-content'>

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

                                {["USD", "EUR", "GBP", "JPY", "AUD"].map((fromCurrency, index) => (
                                    <SwiperSlide key={index}>
                                        <label className="currency-card" onClick={() => window.toSwiperInstance.slideTo(index)}>
                                            <input type="radio" name="toCurrency" value={fromCurrency} />
                                            <span className="currency-card-value">{fromCurrency}</span>
                                        </label>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                        </div>

                        <div className="swiper-button-next to-swiper-button-next swiper-navBtn"></div>
						<div className="swiper-button-prev to-swiper-button-prev swiper-navBtn"></div>
						<div className="swiper-pagination to-swiper-pagination swiper-navBtn"></div>

                    </div>

                </div>

                <button type='submit' className='convert-button'>{isConverting ? (<span className="animated-dots">Converting<span className="dots"></span></span>) : ('Converting')}</button>

            </div>

        </form>
            
        </>
    )
}

export default CurrencyConverter