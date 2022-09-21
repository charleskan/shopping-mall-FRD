import type { NextPage } from 'next'
import Head from 'next/head'
import { Footer } from '../components/Footer'
import { Heading } from '../components/Heading'
import { Navbar } from '../components/Navbar'
import React, { useEffect, useState } from 'react';
import { fetchAddToCart, loadCart } from '../redux/cart/action';
import { useAppSelector, useAppDispatch } from '../store';
import { LoadingState } from '../models'
import { loadOneProduct } from '../redux/product/action'
// import Skeleton from 'react-loading-skeleton'
import { Container } from '@mui/material'
import home from '../styles/Index.module.css'
import cart from '../styles/Cart.module.css'
import CartItem from '../components/CartItem'
import Link from 'next/link'
import { PrintDisabled } from '@mui/icons-material'





const Cart: NextPage = () => {

	const cartLoaded = useAppSelector(state => state.cart.loading)
	const carts = useAppSelector(state => state.cart.products)
	// const products = useAppSelector(state => state.product.products)
	const dispatch = useAppDispatch()

console.log(carts);

const total = carts.map((price)=>{
	


})




// 	const [total, setTotal] = useState(0)
// 	useEffect(() => {
// 		const getTotal = () =>{
// 		const res = ((prev :any, item :any) =>{
// 			return prev +(item.tc_price * item.tc_number)
// 		},0)
// setTotal(res)
// 	}
// getTotal()
// 	}, [])


	
	useEffect(() => {
		// for (const cart of carts) {
		dispatch(loadCart())
		// }
	}, [])


	return (

		<>
			<Heading />
			<Navbar />
			<Head>
				<title>Cart</title>
				<meta
					name='description'
					content='Generated by create next app'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<>
				{console.log('carts:', carts)}
				{/* {console.log('cartLoaded:',cartLoaded ,)} */}
			</>
			<div className={cart.pageBox}>
				<div>
					<h1 className={cart.Title}>Cart</h1>

					<span className={cart.page}>Home. Pages.</span>
					<span className={cart.nowPage}>
					Cart
					</span>
				</div>
				<div></div>
			</div>

				{/* <div className={cart.title}>
				<div>Product</div>
				<div>Name</div>
				<div>Color</div>
				<div>Size</div>
				<div>Stoke</div>
				<div>Price</div>
				</div> */}

<div className={cart.box}>
	<div>
			{
				carts.length > 0 ? carts.map(productInCart =>

					<CartItem
						product={productInCart.product}
						icon={productInCart.icon}
						color={productInCart.color}
						size={productInCart.size}
						tc_number={productInCart.tc_number}
						tc_price={productInCart.tc_price}

						onRemoveFromCart={() => dispatch(fetchRemoveFromCart(productInCart.id))}
						// onMinusFromCart={() => dispatch(onMinusFromCart(productInCart.id))}
						onAddToCart={() => dispatch(fetchAddToCart(productInCart.id))}
						
					/>
				) : <div className={cart.empty}>Cart is empty</div>
			}
			</div>
			<form className={cart.totalBox} >
                <div >
                    <div>Total</div>
             

                </div>
                <button>Proceed To Checkout</button>

			</form>
			

			</div>


			<Footer />
		</>
	)
}


export default Cart